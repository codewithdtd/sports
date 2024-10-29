import 'package:flutter/material.dart';
import 'package:mobile/Screens/Main/booking_detail_screen.dart';
import 'package:mobile/models/sport_type.dart';

class SportTypeItem extends StatelessWidget {
  final String? name;
  final SportType sportType;
  const SportTypeItem({
    super.key,
    required this.size,
    required this.name,
    required this.sportType,
  });

  final Size size;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => BookingDetailScreen(sportType: name)),
        );
      },
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10.0),
        child: Container(
          height: size.width * 0.4, // Chiều cao của từng phần tử
          // color: Colors.cyan[200],
          alignment: Alignment.center,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                const Color.fromARGB(255, 55, 176, 59), // Màu bắt đầu
                const Color.fromARGB(255, 69, 233, 154), // Màu kết thúc
              ],
              begin: Alignment.topCenter, // Điểm bắt đầu gradient
              end: Alignment.bottomCenter, // Điểm kết thúc gradient
            ),
            borderRadius: BorderRadius.circular(20), // Bo góc cho container
          ),
          child: Stack(
            children: [
              Image.network(
                'http://192.168.56.1:3000/uploads/${sportType.hinhAnhDaiDien}',
                height: size.height * 0.2,
                width: size.width,
                fit: BoxFit.cover,
              ),
              Align(
                alignment: Alignment.bottomCenter, // Căn giữa ở cuối
                child: Container(
                  margin: const EdgeInsets.only(
                      bottom: 0), // Khoảng cách từ dưới lên
                  child: Text(
                    sportType.tenLoai!,
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 19.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ), // Nội dung của từng phần tử
        ),
      ),
    );
  }
}
