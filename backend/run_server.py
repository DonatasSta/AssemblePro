import os
import subprocess
import sys

def main():
    """Run Django development server on 0.0.0.0:8000"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'assembleally.settings')
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed?"
        ) from exc
    
    # Change to the backend directory
    os.chdir(os.path.dirname(__file__))
    
    # Run migrations first
    print("Applying database migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Start the server
    print("Starting Django development server...")
    execute_from_command_line(['manage.py', 'runserver', '0.0.0.0:8000'])

if __name__ == '__main__':
    main()
