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

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)