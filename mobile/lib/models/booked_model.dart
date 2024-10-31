import 'package:mobile/models/sport_filed.dart';

class LoaiSan {
  String? id;
  String? tenLoai;
  bool? daXoa;
  String? ngayTao;
  int? v;
  List<String>? hinhAnh; // Thuộc tính có thể có hoặc không
  String? hinhAnhDaiDien; // Thuộc tính có thể có hoặc không

  LoaiSan({
    this.id,
    this.tenLoai,
    this.daXoa,
    this.ngayTao,
    this.v,
    this.hinhAnh,
    this.hinhAnhDaiDien,
  });

  factory LoaiSan.fromJson(Map<String, dynamic> json) {
    return LoaiSan(
      id: json['_id'],
      tenLoai: json['ten_loai'],
      daXoa: json['da_xoa'],
      ngayTao: json['ngayTao'],
      v: json['__v'],
      hinhAnh:
          json['hinhAnh'] != null ? List<String>.from(json['hinhAnh']) : null,
      hinhAnhDaiDien: json['hinhAnhDaiDien'],
    );
  }
}

class KhachHang {
  String? id;
  String? hoKh;
  String? tenKh;
  String? emailKh;
  String? sdtKh;
  bool? daXoa;
  String? ngayTaoKh;
  int? v;

  KhachHang({
    this.id,
    this.hoKh,
    this.tenKh,
    this.emailKh,
    this.sdtKh,
    this.daXoa,
    this.ngayTaoKh,
    this.v,
  });

  factory KhachHang.fromJson(Map<String, dynamic> json) {
    return KhachHang(
      id: json['_id'],
      hoKh: json['ho_KH'],
      tenKh: json['ten_KH'],
      emailKh: json['email_KH'],
      sdtKh: json['sdt_KH'],
      daXoa: json['da_xoa'],
      ngayTaoKh: json['ngayTao_KH'],
      v: json['__v'],
    );
  }
}

class DichVu {
  String? id;
  String? tenDv;
  int? gia;
  String? ngayTaoDv;
  bool? daXoa;
  int? v;
  int? soLuong;
  int? choMuon;
  int? tonKho;
  int? soluong;
  int? thanhTien;

  DichVu({
    this.id,
    this.tenDv,
    this.gia,
    this.ngayTaoDv,
    this.daXoa,
    this.v,
    this.soLuong,
    this.choMuon,
    this.tonKho,
    this.soluong,
    this.thanhTien,
  });

  factory DichVu.fromJson(Map<String, dynamic> json) {
    return DichVu(
      id: json['_id'],
      tenDv: json['ten_DV'],
      gia: json['gia'],
      ngayTaoDv: json['ngayTao_DV'],
      daXoa: json['da_xoa'],
      v: json['__v'],
      soLuong: json['so_luong'],
      choMuon: json['choMuon'],
      tonKho: json['tonKho'],
      soluong: json['soluong'],
      thanhTien: json['thanhTien'],
    );
  }
}

class DatSan {
  String? id;
  KhachHang? khachHang;
  String? trangThai;
  String? trangThaiThanhToan;
  SportFieldBooked? san; // Có thể định nghĩa rõ hơn nếu cần
  String? thoiGianBatDau;
  String? thoiGianKetThuc;
  String? thoiGianCheckIn;
  String? thoiGianCheckOut;
  List<DichVu>? dichVu;
  int? thanhTien;
  String? ngayDat;
  String? expireAt; // Có thể có hoặc không
  bool? daXoa;
  String? ngayTao;
  int? v;

  DatSan({
    this.id,
    this.khachHang,
    this.trangThai,
    this.trangThaiThanhToan,
    this.san,
    this.thoiGianBatDau,
    this.thoiGianKetThuc,
    this.thoiGianCheckIn,
    this.thoiGianCheckOut,
    this.dichVu,
    this.thanhTien,
    this.ngayDat,
    this.expireAt,
    this.daXoa,
    this.ngayTao,
    this.v,
  });

  factory DatSan.fromJson(Map<String, dynamic> json) {
    return DatSan(
      id: json['_id'],
      khachHang: KhachHang.fromJson(json['khachHang']),
      trangThai: json['trangThai'],
      trangThaiThanhToan: json['trangThaiThanhToan'],
      san: SportFieldBooked.fromJson(json["loai_san"]), // Có thể định nghĩa rõ hơn nếu cần
      thoiGianBatDau: json['thoiGianBatDau'],
      thoiGianKetThuc: json['thoiGianKetThuc'],
      thoiGianCheckIn: json['thoiGianCheckIn'],
      thoiGianCheckOut: json['thoiGianCheckOut'],
      dichVu: List<DichVu>.from(json['dichVu'].map((x) => DichVu.fromJson(x))),
      thanhTien: json['thanhTien'],
      ngayDat: json['ngayDat'],
      expireAt: json['expireAt'],
      daXoa: json['da_xoa'],
      ngayTao: json['ngayTao'],
      v: json['__v'],
    );
  }
}

class SportFieldBooked {
  String? id;
  String? tenSan;
  LoaiSan? loaiSan;
  String? tinhTrang;
  String? khuVuc;
  String? hinhAnhSan;
  String? ngayTaoSan;
  String? ngayCapNhatSan;
  bool? daXoa;
  int? bangGiaMoiGio;
  String? maSan;
  String? idAsString;
  DatSan? datSan; // Có thể có hoặc không

  SportFieldBooked({
    this.id,
    this.tenSan,
    this.loaiSan,
    this.tinhTrang,
    this.khuVuc,
    this.hinhAnhSan,
    this.ngayTaoSan,
    this.ngayCapNhatSan,
    this.daXoa,
    this.bangGiaMoiGio,
    this.maSan,
    this.idAsString,
    this.datSan,
  });

  factory SportFieldBooked.fromJson(Map<String, dynamic> json) {
    return SportFieldBooked(
      id: json['_id'],
      tenSan: json['ten_San'],
      loaiSan: LoaiSan.fromJson(json['loai_San']),
      tinhTrang: json['tinhTrang'],
      khuVuc: json['khuVuc'],
      hinhAnhSan: json['hinhAnh_San'],
      ngayTaoSan: json['ngayTao_San'],
      ngayCapNhatSan: json['ngayCapNhat_San'],
      daXoa: json['da_xoa'],
      bangGiaMoiGio: json['bangGiaMoiGio'],
      maSan: json['ma_San'],
      idAsString: json['_idAsString'],
      datSan: json['datSan'] != null ? DatSan.fromJson(json['datSan']) : null,
    );
  }
}
