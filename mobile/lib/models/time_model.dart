class Time {
  Time({
    this.id,
    this.thoiGianDongCua,
    this.thoiGianMoCua,
    this.daXoa,
  });

  final String? id;
  final String? thoiGianDongCua;
  final String? thoiGianMoCua;
  final bool? daXoa;

  factory Time.fromJson(Map<String, dynamic> json) {
    return Time(
      id: json["_id"],
      thoiGianDongCua: json["thoiGianDongCua"],
      thoiGianMoCua: json["thoiGianMoCua"],
      daXoa: json["da_xoa"],
    );
  }
}
