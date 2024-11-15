class NotificationModel {
  String? id;
  String? nguoiDung;
  String? tieuDe;
  String? noiDung;
  bool? daXem;
  bool? daXoa;
  String? ngayTao;
  int? iV;

  NotificationModel(
      {this.id,
      this.nguoiDung,
      this.tieuDe,
      this.noiDung,
      this.daXem,
      this.daXoa,
      this.ngayTao,
      this.iV});

  NotificationModel.fromJson(Map<String, dynamic> json) {
    id = json['_id'];
    nguoiDung = json['nguoiDung'];
    tieuDe = json['tieuDe'];
    noiDung = json['noiDung'];
    daXem = json['daXem'];
    daXoa = json['da_xoa'];
    ngayTao = json['ngayTao'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.id;
    data['nguoiDung'] = this.nguoiDung;
    data['tieuDe'] = this.tieuDe;
    data['noiDung'] = this.noiDung;
    data['daXem'] = this.daXem;
    data['da_xoa'] = this.daXoa;
    data['ngayTao'] = this.ngayTao;
    data['__v'] = this.iV;
    return data;
  }
}
