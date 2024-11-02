class Service {
  Service({
    required this.id,
    required this.tenDv,
    required this.tonKho,
    required this.choMuon,
    required this.gia,
    required this.daXoa,
    required this.ngayTaoDv,
    required this.v,
  });

  final String? id;
  final String? tenDv;
  final int? tonKho;
  final int? choMuon;
  final int? gia;
  final bool? daXoa;
  final String? ngayTaoDv;
  final int? v;

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json["_id"],
      tenDv: json["ten_DV"],
      tonKho: json["tonKho"],
      choMuon: json["choMuon"],
      gia: json["gia"],
      daXoa: json["da_xoa"],
      ngayTaoDv: json["ngayTao_DV"],
      v: json["__v"],
    );
  }
}
