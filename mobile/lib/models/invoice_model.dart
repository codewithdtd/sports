import 'package:mobile/models/booked_model.dart';

class Invoice {
  Invoice({
    this.id,
    this.datSan,
    this.nhanVien,
    this.khachHang,
    this.ghiChu,
    this.phuongThucThanhToan,
    this.tongTien,
    this.phuThu,
    this.daXoa,
    this.ngayTaoHd,
    this.v,
  });

  final String? id;
  final DatSan? datSan;
  final NhanVien? nhanVien;
  final KhachHang? khachHang;
  final String? ghiChu;
  final String? phuongThucThanhToan;
  final int? tongTien;
  final int? phuThu;
  final bool? daXoa;
  final String? ngayTaoHd;
  final int? v;

  factory Invoice.fromJson(Map<String, dynamic> json) {
    return Invoice(
      id: json["_id"],
      datSan: json["datSan"] == null ? null : DatSan.fromJson(json["datSan"]),
      nhanVien:
          json["nhanVien"] == null ? null : NhanVien.fromJson(json["nhanVien"]),
      khachHang: json["khachHang"] == null
          ? null
          : KhachHang.fromJson(json["khachHang"]),
      ghiChu: json["ghiChu"],
      phuongThucThanhToan: json["phuongThucThanhToan"],
      tongTien: json["tongTien"],
      phuThu: json["phuThu"],
      daXoa: json["da_xoa"],
      ngayTaoHd: json["ngayTao_HD"],
      v: json["__v"],
    );
  }
}

class NhanVien {
  NhanVien({
    this.id,
    this.hoNv,
    this.tenNv,
    this.emailNv,
    this.sdtNv,
    this.chucVu,
    this.daXoa,
    this.v,
    this.hinhAnhNv,
  });

  final String? id;
  final String? hoNv;
  final String? tenNv;
  final String? emailNv;
  final String? sdtNv;
  final String? chucVu;
  final bool? daXoa;
  final int? v;
  final String? hinhAnhNv;

  factory NhanVien.fromJson(Map<String, dynamic> json) {
    return NhanVien(
      id: json["_id"],
      hoNv: json["ho_NV"],
      tenNv: json["ten_NV"],
      emailNv: json["email_NV"],
      sdtNv: json["sdt_NV"],
      chucVu: json["chuc_vu"],
      daXoa: json["da_xoa"],
      v: json["__v"],
      hinhAnhNv: json["hinhAnh_NV"],
    );
  }
}
