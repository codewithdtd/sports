import 'package:mobile/models/booked_model.dart';
import 'package:mobile/models/user.dart';

class Rating {
  final String? id;
  final Customer? customer;
  final String? rating;
  final String? content;
  final String? createdAt;
  final int? version;
  final bool? isHided;
  final Feedback? feedback;
  final DatSan? datSan;

  Rating({
    this.id,
    this.customer,
    this.rating,
    this.content,
    this.isHided,
    this.createdAt,
    this.version,
    this.feedback,
    this.datSan,
  });

  factory Rating.fromJson(Map<String, dynamic> json) {
    return Rating(
      id: json['_id'],
      customer: Customer.fromJson(json['khachHang']),
      rating: json['danhGia'],
      content: json['noiDung'],
      datSan: DatSan.fromJson(json['datSan']),
      createdAt: json['ngayTao_DG'],
      version: json['__v'],
      isHided: json['da_an'],
      feedback:
          json['phanHoi'] != null ? Feedback.fromJson(json['phanHoi']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = {
      '_id': id,
      'khachHang': customer?.toJson(),
      'danhGia': rating,
      'noiDung': content,
      'datSan': datSan?.toJson(),
      'ngayTao_DG': createdAt,
      '__v': version,
    };

    // Chỉ thêm 'phanHoi' nếu feedback không phải là null
    if (feedback != null) {
      data['phanHoi'] = feedback?.toJson();
    }

    return data;
  }
}

class Customer {
  final String? id;
  final String? firstName;
  final String? lastName;
  final String? email;
  final String? phoneNumber;
  final String? createdAt;
  final int? version;

  Customer({
    this.id,
    this.firstName,
    this.lastName,
    this.email,
    this.phoneNumber,
    this.createdAt,
    this.version,
  });

  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      id: json['_id'],
      firstName: json['ho_KH'],
      lastName: json['ten_KH'],
      email: json['email_KH'],
      phoneNumber: json['sdt_KH'],
      createdAt: json['ngayTao_KH'],
      version: json['__v'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'ho_KH': firstName,
      'ten_KH': lastName,
      'email_KH': email,
      'sdt_KH': phoneNumber,
      'ngayTao_KH': createdAt,
      '__v': version,
    };
  }

  static Customer fromUser(User user) {
    return Customer(
      id: user.id,
      firstName: user.hoKh,
      lastName: user.tenKh,
      email: user.emailKh,
      phoneNumber: user.sdtKh,
      // Các trường khác có thể được ánh xạ tương ứng nếu cần
    );
  }
}

class Feedback {
  final Employee? employee;
  final String? content;
  final String? createdAt;

  Feedback({
    this.employee,
    this.content,
    this.createdAt,
  });

  factory Feedback.fromJson(Map<String, dynamic> json) {
    return Feedback(
      employee: Employee.fromJson(json['nhanVien']),
      content: json['noiDung'],
      createdAt: json['ngayTao'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'nhanVien': employee?.toJson(),
      'noiDung': content,
      'ngayTao': createdAt,
    };
  }
}

class Employee {
  final String? id;
  final String? firstName;
  final String? lastName;
  final String? email;
  final String? phoneNumber;
  final String? position;
  final int? version;
  final String? image;

  Employee({
    this.id,
    this.firstName,
    this.lastName,
    this.email,
    this.phoneNumber,
    this.position,
    this.version,
    this.image,
  });

  factory Employee.fromJson(Map<String, dynamic> json) {
    return Employee(
      id: json['_id'],
      firstName: json['ho_NV'],
      lastName: json['ten_NV'],
      email: json['email_NV'],
      phoneNumber: json['sdt_NV'],
      position: json['chuc_vu'],
      version: json['__v'],
      image: json['hinhAnh_NV'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'ho_NV': firstName,
      'ten_NV': lastName,
      'email_NV': email,
      'sdt_NV': phoneNumber,
      'chuc_vu': position,
      '__v': version,
      'hinhAnh_NV': image,
    };
  }
}
