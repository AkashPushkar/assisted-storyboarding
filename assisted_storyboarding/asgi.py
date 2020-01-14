import os 
import django
from channels.routing import get_default_application


os.environ.setDefault("DJANGO_SETTINGS_MODULE", "assisted_storyboarding.settings")
django.setup()
application = get_default_application()
