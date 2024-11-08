import 'dart:convert';
import 'package:mobile/contants.dart';
import 'package:mobile/models/invoice_model.dart';
import 'package:mobile/services/api.dart';

class InvoiceService extends ApiService<Invoice> {
  InvoiceService({String? token})
      : super(baseUrl: '${ipURL}api/user/invoice', token: token);

  @override
  List<Invoice> parseResponse(String responseBody) {
    var list = json.decode(responseBody) as List<dynamic>;
    return list.map((userJson) => Invoice.fromJson(userJson)).toList();
  }

  @override
  Invoice fromJson(Map<String, dynamic> json) {
    return Invoice.fromJson(json);
  }

  // Gọi phương thức chung của ApiService
  Future<List<Invoice>> getAll({Map<String, String?>? queryParams}) async {
    return await fetchData('/', queryParams: queryParams);
  }

  Future<Invoice> getOne(String id) async {
    return await fetchOne('/findOne/$id');
  }
}
