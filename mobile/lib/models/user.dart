class User {
  User({
    this.id,
    this.hoKh,
    this.tenKh,
    this.emailKh,
    this.hinhAnhKh,
    required this.sdtKh,
    required this.matKhauKh,
  });

  final String? id;
  final String? hoKh;
  final String? tenKh;
  final String? hinhAnhKh;
  final String? emailKh;
  final String? sdtKh;
  final String? matKhauKh;

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json["_id"],
      hoKh: json["ho_KH"],
      tenKh: json["ten_KH"],
      hinhAnhKh: json["hinhAnh_KH"],
      emailKh: json["email_KH"],
      sdtKh: json["sdt_KH"],
      matKhauKh: json["matKhau_KH"],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "_id": id,
      "ho_KH": hoKh,
      "ten_KH": tenKh,
      "hinhAnh_KH": hinhAnhKh,
      "email_KH": emailKh,
      "sdt_KH": sdtKh,
      "matKhau_KH": matKhauKh,
    };
  }
}
