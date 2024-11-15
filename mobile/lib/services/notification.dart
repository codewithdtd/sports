import 'dart:convert';
import 'package:mobile/models/notification_model.dart';
import 'package:mobile/services/api.dart';

class NotifyService extends ApiService<NotificationModel> {
  NotifyService({String? token})
      : super(
            baseUrl: 'http://192.168.56.1:3000/api/user/notify', token: token);

  @override
  List<NotificationModel> parseResponse(String responseBody) {
    var list = json.decode(responseBody) as List<dynamic>;
    return list
        .map((userJson) => NotificationModel.fromJson(userJson))
        .toList();
  }

  @override
  NotificationModel fromJson(Map<String, dynamic> json) {
    return NotificationModel.fromJson(json);
  }

  // Gọi phương thức chung của ApiService
  Future<List<NotificationModel>> getAll(String id) async {
    return await fetchData('/$id');
  }

  Future<NotificationModel> createNotify(Map<String, dynamic> userData) async {
    return await createData('/', userData);
  }

  Future<NotificationModel> updateNotify(
      String id, Map<String, dynamic> userData) async {
    return await updateData('/$id', userData);
  }

  Future<void> deleteNotify(String id) async {
    await deleteData('/$id');
  }
}
