from django.shortcuts import render
from .models import Users

# Create your views here.

def test_view(request):
    # data = Users.objects.all()
    users = Users.objects.values()
    context = {
        'users' : users
    }
    return render(request, 'users.html', context)
