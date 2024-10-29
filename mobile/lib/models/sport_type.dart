class SportType {
  SportType({
    required this.id,
    required this.tenLoai,
    required this.daXoa,
    required this.ngayTao,
    required this.v,
    required this.hinhAnh,
    required this.hinhAnhDaiDien,
  });

  final String? id;
  final String? tenLoai;
  final bool? daXoa;
  final String? ngayTao;
  final int? v;
  final List<String> hinhAnh;
  final String? hinhAnhDaiDien;

  factory SportType.fromJson(Map<String, dynamic> json) {
    return SportType(
      id: json["_id"],
      tenLoai: json["ten_loai"],
      daXoa: json["da_xoa"],
      ngayTao: json["ngayTao"],
      v: json["__v"],
      hinhAnh: json["hinhAnh"] == null
          ? []
          : List<String>.from(json["hinhAnh"]!.map((x) => x)),
      hinhAnhDaiDien: json["hinhAnhDaiDien"],
    );
  }
}
