import 'dart:convert';
import 'package:mobile/models/booked_model.dart';
import 'package:mobile/models/sport_type.dart';
import 'package:mobile/services/api.dart';

class BookingService extends ApiService<DatSan> {
  BookingService({String? token})
      : super(
            baseUrl: 'http://192.168.56.1:3000/api/user/booking', token: token);

  @override
  List<DatSan> parseResponse(String responseBody) {
    var list = json.decode(responseBody) as List<dynamic>;
    return list.map((userJson) => DatSan.fromJson(userJson)).toList();
  }

  @override
  DatSan fromJson(Map<String, dynamic> json) {
    return DatSan.fromJson(json);
  }

  // Gọi phương thức chung của ApiService
  Future<List<DatSan>> getAll() async {
    return await fetchData('/');
  }

  Future<DatSan> getOne(String id) async {
    return await fetchOne('/$id');
  }

  Future<DatSan> createBooking(Map<String, dynamic> userData) async {
    return await createData('/', userData);
  }

  Future<DatSan> updateBooking(String id, Map<String, dynamic> userData) async {
    return await updateData('/$id', userData);
  }

  Future<void> deleteBooking(String id) async {
    await deleteData('/$id');
  }
}
