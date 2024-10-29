class SportField {
  SportField({
    required this.id,
    required this.tenSan,
    required this.loaiSan,
    required this.tinhTrang,
    required this.khuVuc,
    required this.hinhAnhSan,
    required this.daXoa,
    required this.bangGiaMoiGio,
    required this.maSan,
  });

  final Id? id;
  final String? tenSan;
  final LoaiSan? loaiSan;
  final String? tinhTrang;
  final String? khuVuc;
  final String? hinhAnhSan;
  final bool? daXoa;
  final int? bangGiaMoiGio;
  final String? maSan;

  factory SportField.fromJson(Map<String, dynamic> json) {
    return SportField(
      id: json["_id"] == null ? null : Id.fromJson(json["_id"]),
      tenSan: json["ten_San"],
      loaiSan:
          json["loai_San"] == null ? null : LoaiSan.fromJson(json["loai_San"]),
      tinhTrang: json["tinhTrang"],
      khuVuc: json["khuVuc"],
      hinhAnhSan: json["hinhAnh_San"],
      daXoa: json["da_xoa"],
      bangGiaMoiGio: json["bangGiaMoiGio"],
      maSan: json["ma_San"],
    );
  }
}

class Id {
  Id({
    required this.oid,
  });

  final String? oid;

  factory Id.fromJson(Map<String, dynamic> json) {
    return Id(
      oid: json["\u0024oid"],
    );
  }
}

class LoaiSan {
  LoaiSan({
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

  factory LoaiSan.fromJson(Map<String, dynamic> json) {
    return LoaiSan(
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
