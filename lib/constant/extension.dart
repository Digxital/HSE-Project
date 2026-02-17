extension ExtString on String {
  bool get isValidEmail {
    final emailRegExp =
        RegExp(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
    return emailRegExp.hasMatch(this);
  }

  bool get isValidPassword {
    final passwordRegExp =
        RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$');
    return passwordRegExp.hasMatch(this);
  }
}

class RegexCheck {
  static const String numberCheck = r"^(?:[+0]9)?[0-9]{11,15}$";
  static const String emailCheck =
      r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$";
  static const String passwordCheck =
      r"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\/\$&*~]).{6,}$";
  static const String usernameCheck =
      r"^(?=.{5,25}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$";
  static const String lessThan8CharCheck =
      r"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\/\$&*~]).{6,}$";
  static const String containsUpperCaseCheck = r"(?=.*[A-Z])\w+";
  static const String containsLowwerCaseCheck = r"(?=.*[a-z])\w+";
  static const String containsNumCaseCheck = r"(?=.*[0-9])\w+";
  static const String containsSpecialCharCheck =
      r'[\^$*.\[\]{}()?\-"!@#%&/\,><:;_~`+=' "'" ']';
}
