import 'package:flutter/material.dart';
import 'package:mobile/services/notification.dart';
import 'package:mobile/stores/user_provider.dart';
import 'package:provider/provider.dart';
import 'package:mobile/models/notification_model.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  late Future<List<NotificationModel>> _list;

  Future<List<NotificationModel>> _getAllData() async {
    final String? token =
        Provider.of<UserProvider>(context, listen: false).token;
    final String? userId =
        Provider.of<UserProvider>(context, listen: false).user?.id;
    final response =
        await NotifyService(token: token).getAll(userId.toString());
    return response.reversed.toList();
  }

  Future<void> _createNotify(NotificationModel item) async {
    final String? token =
        Provider.of<UserProvider>(context, listen: false).token;
    item.daXem = true;
    final result = await NotifyService(token: token)
        .createNotify(item as Map<String, dynamic>);
    if (result.daXem != null) {
      _list = _getAllData();
    }
  }

  Future<void> _updateNotify(NotificationModel item) async {
    final String? token =
        Provider.of<UserProvider>(context, listen: false).token;
    item.daXem = true;
    final result = await NotifyService(token: token)
        .updateNotify(item.id.toString(), item.toJson());
    if (result.daXem != null) {
      setState(() {
        _list = _getAllData();
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _list = _getAllData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(
              Icons.notifications_active_outlined,
              color: Colors.white,
              size: 30.0,
            ),
            SizedBox(
              width: 8.0,
            ),
            Text(
              'Thông báo',
              style:
                  TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
            ),
          ],
        ),
        backgroundColor: Colors.greenAccent[700],
        automaticallyImplyLeading: false,
      ),
      body: Container(
        color: Colors.grey[300],
        child: FutureBuilder(
          future: _list,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return const Center(child: Text('Đã xảy ra lỗi khi tải dữ liệu'));
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return const Center(child: Text('Không có dữ liệu'));
            } else {
              final list = snapshot.data!;
              return ListView.builder(
                padding: const EdgeInsets.only(
                    left: 16.0, right: 16.0, bottom: 15.0),
                itemCount: list.length,
                itemBuilder: (context, index) {
                  final item = list[index];
                  return GestureDetector(
                    onTap: () => _updateNotify(item),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 7.0, vertical: 15.0),
                      decoration: BoxDecoration(
                        color: Color.fromARGB(255, 255, 255, 255),
                        borderRadius: BorderRadius.circular(5.0),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.7),
                            spreadRadius: 3,
                            blurRadius: 5,
                            offset: const Offset(3, 3),
                          ),
                        ],
                      ),
                      margin: const EdgeInsets.symmetric(vertical: 10.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '${item.tieuDe}',
                                style: TextStyle(
                                  color: item.tieuDe == 'Hủy sân'
                                      ? Colors.red[700]
                                      : Colors.green,
                                  fontSize: 18.0,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              if (item.daXem == false)
                                Image.asset(
                                  'assets/images/sign.png',
                                  width: 40.0,
                                ),
                              if (item.daXem != false)
                                Row(
                                  children: [
                                    Icon(Icons.check_outlined),
                                    Text('Đã xem'),
                                  ],
                                ),
                            ],
                          ),
                          Text(
                            '${item.noiDung}',
                            style: TextStyle(fontSize: 16.0),
                          ),
                          Text(
                            '${item.ngayTao}',
                            style: TextStyle(
                              color: Colors.black54,
                              fontWeight: FontWeight.bold,
                            ),
                          )
                        ],
                      ),
                    ),
                  );
                },
              );
            }
          },
        ),
      ),
    );
  }
}
