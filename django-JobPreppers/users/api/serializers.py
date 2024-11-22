from rest_framework.serializers import ModelSerializer
from ..models import Users

class UserSerializer(ModelSerializer): 
    class Meta:
        model = Users
        fields = ('username', 'password')



