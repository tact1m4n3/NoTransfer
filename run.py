from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

HOST = "127.0.0.1"
PORT = 8000

class MyRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, directory="website", **kwargs)

if __name__ == "__main__":
    print("[INFO] Server started on {}:{}".format(HOST, PORT))
    server = ThreadingHTTPServer((HOST, PORT), MyRequestHandler)
    server.serve_forever()
