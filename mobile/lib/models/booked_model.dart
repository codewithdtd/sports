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

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'ten_loai': tenLoai,
      'da_xoa': daXoa ?? false,
      'ngayTao': ngayTao,
      '__v': v,
      'hinhAnh': hinhAnh,
      'hinhAnhDaiDien': hinhAnhDaiDien,
    };
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

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'ho_KH': hoKh,
      'ten_KH': tenKh,
      'email_KH': emailKh,
      'sdt_KH': sdtKh,
      'da_xoa': daXoa ?? false,
      'ngayTao_KH': ngayTaoKh,
      '__v': v,
    };
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

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'ten_DV': tenDv,
      'gia': gia,
      'ngayTao_DV': ngayTaoDv,
      'da_xoa': daXoa ?? false,
      '__v': v,
      'so_luong': soLuong,
      'choMuon': choMuon,
      'tonKho': tonKho,
      'soluong': soluong,
      'thanhTien': thanhTien,
    };
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
  bool? yeuCauHuy;
  String? ghiChu;
  List<DichVu>? dichVu;
  int? thanhTien;
  String? ngayDat;
  // ignore: non_constant_identifier_names
  String? app_trans_id;
  // ignore: non_constant_identifier_names
  String? order_url;
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
    this.ghiChu,
    this.thanhTien,
    this.ngayDat,
    this.yeuCauHuy,
    // ignore: non_constant_identifier_names
    this.app_trans_id,
    // ignore: non_constant_identifier_names
    this.order_url,
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
      san: SportFieldBooked.fromJson(
          json["san"]), // Có thể định nghĩa rõ hơn nếu cần
      thoiGianBatDau: json['thoiGianBatDau'],
      thoiGianKetThuc: json['thoiGianKetThuc'],
      thoiGianCheckIn: json['thoiGianCheckIn'],
      thoiGianCheckOut: json['thoiGianCheckOut'],
      yeuCauHuy: json['yeuCauHuy'],
      ghiChu: json["ghiChu"],
      dichVu: List<DichVu>.from(json['dichVu'].map((x) => DichVu.fromJson(x))),
      thanhTien: json['thanhTien'],
      ngayDat: json['ngayDat'],
      // ignore: unnecessary_null_in_if_null_operators
      order_url: json['order_url'],
      // ignore: prefer_if_null_operators
      app_trans_id: json['app_trans_id'],
      expireAt: json['expireAt'],
      daXoa: json['da_xoa'],
      ngayTao: json['ngayTao'],
      v: json['__v'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'khachHang': khachHang?.toJson(),
      'trangThai': trangThai,
      'trangThaiThanhToan': trangThaiThanhToan,
      'san': san?.toJson(),
      'thoiGianBatDau': thoiGianBatDau,
      'thoiGianKetThuc': thoiGianKetThuc,
      'thoiGianCheckIn': thoiGianCheckIn,
      'thoiGianCheckOut': thoiGianCheckOut,
      'yeuCauHuy': yeuCauHuy,
      'ghiChu': ghiChu,
      'dichVu': dichVu?.map((x) => x.toJson()).toList(),
      'thanhTien': thanhTien,
      'ngayDat': ngayDat,
      'app_trans_id': app_trans_id,
      'order_url': order_url,
      'expireAt': expireAt,
      'da_xoa': daXoa ?? false,
      'ngayTao': ngayTao,
      '__v': v,
    };
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

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'ten_San': tenSan,
      'loai_San': loaiSan?.toJson(),
      'tinhTrang': tinhTrang,
      'khuVuc': khuVuc,
      'hinhAnh_San': hinhAnhSan,
      'ngayTao_San': ngayTaoSan,
      'ngayCapNhat_San': ngayCapNhatSan,
      'da_xoa': daXoa ?? false,
      'bangGiaMoiGio': bangGiaMoiGio,
      'ma_San': maSan,
      '_idAsString': idAsString,
      'datSan': datSan?.toJson(),
    };
  }
}
