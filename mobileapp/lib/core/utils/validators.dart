extension EmailValidator on String {
  bool get isValidEmail {
    final emailRegExp = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    return emailRegExp.hasMatch(this);
  }
}

extension PasswordValidator on String {
  bool get isValidPassword {
    return length >= 6;
  }
}