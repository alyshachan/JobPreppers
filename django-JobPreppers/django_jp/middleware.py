class DebugMiddleware:
    def __init__(self, get_response):
        print("DebugMiddleware initialized")
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        print("Request headers:", request.headers)
        print("Response headers:", response.headers)
        return response
