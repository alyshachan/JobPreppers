from django.shortcuts import render
from ..models import Users
from rest_framework.viewsets import ModelViewSet
from .serializers import UserSerializer

# Create your views here.

def test_view(request):
    # data = Users.objects.all()
    users = Users.objects.values()
    context = {
        'users' : users
    }
    return render(request, 'users.html', context)


class UserViewSet(ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UserSerializer

