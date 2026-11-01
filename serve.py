# Geliştirme sunucusu: önbelleksiz statik sunucu. Kullanım: python serve.py
import http.server, socketserver
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(('', 8766), H) as s:
    print('http://localhost:8766')
    s.serve_forever()
