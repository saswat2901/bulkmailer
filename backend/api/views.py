import pandas as pd
import re

from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.core.mail import EmailMessage
from django.conf import settings


@api_view(['GET'])
def test_api(request):

    return Response({
        "message": "Backend is working successfully"
    })


@api_view(['POST'])
def send_emails(request):

    try:

        excel_file = request.FILES.get('excel')
        resume_file = request.FILES.get('resume')

        subject = request.data.get('subject')
        message = request.data.get('message')

        if not excel_file or not resume_file:

            return Response({
                "error": "Excel file and Resume are required"
            }, status=400)

        if not subject or not message:

            return Response({
                "error": "Subject and Message are required"
            }, status=400)

        print("FILES RECEIVED SUCCESSFULLY")

        # Read Excel
        df = pd.read_excel(excel_file)

        print("EXCEL READ SUCCESSFULLY")

        # Validate Email column
        if 'Email' not in df.columns:

            return Response({
                "error": "Excel must contain 'Email' column"
            }, status=400)

        success_emails = []
        failed_emails = []

        # Email Regex Validation
        email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'

        # Read Resume Once
        resume_content = resume_file.read()

        for _, row in df.iterrows():

            try:

                email = str(row['Email']).strip()

                print(f"SENDING EMAIL TO: {email}")

                # Email Validation
                if not re.match(email_pattern, email):

                    print(f"INVALID EMAIL: {email}")

                    failed_emails.append(email)

                    continue

                mail = EmailMessage(
                    subject,
                    message,
                    settings.EMAIL_HOST_USER,
                    [email]
                )

                mail.attach(
                    resume_file.name,
                    resume_content,
                    resume_file.content_type
                )

                mail.send()

                print(f"EMAIL SENT SUCCESSFULLY TO: {email}")

                success_emails.append(email)

            except Exception as e:

                print("EMAIL ERROR:", str(e))

                failed_emails.append(email)

        return Response({

            "message": "Email process completed",

            "success_count": len(success_emails),

            "failed_count": len(failed_emails),

            "success_emails": success_emails,

            "failed_emails": failed_emails
        })

    except Exception as e:

        print("MAIN ERROR:", str(e))

        return Response({
            "error": str(e)
        }, status=500)