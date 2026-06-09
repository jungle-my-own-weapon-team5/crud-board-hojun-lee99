"""
jwt 구현용 
hash_password()
verify_password()
create_access_token()
decode_access_token()
"""
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

def hash_password(plain_password: str) -> str:
    return password_hash.hash(plain_password)