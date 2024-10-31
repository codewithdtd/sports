import 'package:mobile/models/booking_models.dart';

class SportField {
  SportField({
    required this.id,
    required this.maSan,
    required this.tenSan,
    required this.loaiSan,
    required this.tinhTrang,
    required this.khuVuc,
    required this.bangGiaMoiGio,
    required this.daXoa,
    required this.ngayTaoSan,
    required this.v,
    required this.hinhAnhSan,
    this.datSan,
  });

  final String? id;
  final String? maSan;
  final String? tenSan;
  final LoaiSan? loaiSan;
  final String? tinhTrang;
  final String? khuVuc;
  final int? bangGiaMoiGio;
  final bool? daXoa;
  final String? ngayTaoSan;
  final int? v;
  final String? hinhAnhSan;
  final Booking? datSan;

  factory SportField.fromJson(Map<String, dynamic> json) {
    return SportField(
      id: json["_id"],
      maSan: json["ma_San"],
      tenSan: json["ten_San"],
      loaiSan:
          json["loai_San"] == null ? null : LoaiSan.fromJson(json["loai_San"]),
      tinhTrang: json["tinhTrang"],
      khuVuc: json["khuVuc"],
      bangGiaMoiGio: json["bangGiaMoiGio"],
      daXoa: json["da_xoa"],
      ngayTaoSan: json["ngayTao_San"],
      v: json["__v"],
      hinhAnhSan: json["hinhAnh_San"],
      datSan: json["datSan"] == null ? null : Booking.fromJson(json["datSan"]),
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
