class User {
  User({
    this.id,
    this.hoKh,
    this.tenKh,
    this.emailKh,
    required this.sdtKh,
    required this.matKhauKh,
  });

  final String? id;
  final String? hoKh;
  final String? tenKh;
  final String? emailKh;
  final String? sdtKh;
  final String? matKhauKh;

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json["_id"],
      hoKh: json["ho_KH"],
      tenKh: json["ten_KH"],
      emailKh: json["email_KH"],
      sdtKh: json["sdt_KH"],
      matKhauKh: json["matKhau_KH"],
    );
  }

}
