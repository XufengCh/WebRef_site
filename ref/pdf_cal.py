# To deal with pdf files
import hashlib


DEFAULT_INFO = {
    'type': 'article',
    'author': '',

}

def get_pdf_md5_hash(pdf):
    BLOCKSIZE = 65536
    hasher = hashlib.md5()

    buf = pdf.read(BLOCKSIZE)
    while len(buf) > 0:
        hasher.update(buf)
        buf = pdf.read(BLOCKSIZE)

    return hasher.hexdigest()

