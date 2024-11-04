import 'package:flutter/material.dart';
import 'package:mobile/components/rounded_input_field.dart';
import 'package:mobile/components/sport_type.dart';
import 'package:mobile/models/sport_type.dart';
import 'package:mobile/services/sport_type.dart';

class BookingScreen extends StatefulWidget {
  static const routeName = '/';

  const BookingScreen({super.key});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  late SportTypeService _sportTypeService;
  List<SportType> _sportTypes = [];
  List<SportType> _filteredSportTypes = [];
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _sportTypeService = SportTypeService();
    _loadSportTypes();
  }

  void _onSearchChanged(String query) {
    setState(() {
      _searchQuery = query;
      _filteredSportTypes = _sportTypes
          .where((sportType) =>
              sportType.tenLoai!.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  Future<void> _loadSportTypes() async {
    try {
      final data = await _sportTypeService.getAll();
      setState(() {
        _sportTypes = data;
        _filteredSportTypes = data;
      });
    } catch (e) {
      print('Failed to load sport types: $e');
    }
  }

  Future<List<SportType>> _fetchSportTypes() async {
    try {
      final data = await _sportTypeService.getAll();
      return data;
    } catch (e) {
      // Xử lý lỗi nếu cần thiết
      // ignore: avoid_print
      print('Failed to load sport types: $e');
      return []; // Trả về danh sách rỗng trong trường hợp lỗi
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: Column(
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              // Thẻ ảnh
              ClipRRect(
                borderRadius:
                    const BorderRadius.vertical(bottom: Radius.circular(30.0)),
                child: Image.asset(
                  'assets/images/booking.jpg',
                  height: MediaQuery.of(context).size.height * 0.3,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
              // Thẻ gradient
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Container(
                  height: MediaQuery.of(context).size.height * 0.2,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.transparent, // Trong suốt
                        Colors.green.withOpacity(0.8), // Xanh nhạt với độ mờ
                      ],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                    borderRadius: const BorderRadius.vertical(
                        bottom: Radius.circular(30.0)),
                  ),
                ),
              ),
              // Thẻ chữ
              const Positioned(
                bottom: 40, // Điều chỉnh vị trí theo nhu cầu
                left: 16,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Dsport',
                      style: TextStyle(
                        fontSize: 40,
                        color: Color.fromARGB(255, 255, 255,
                            255), // Thay đổi màu chữ để nổi bật trên ảnh
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    Text(
                      "Nơi thỏa mãn niềm đam mê thể thao của bạn",
                      style: TextStyle(
                          color: Colors.white, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),
              // Thẻ Positioned thứ hai nằm trong Stack
              Positioned(
                bottom: -30.0, // Thay đổi giá trị để điều chỉnh vị trí
                left: MediaQuery.of(context).size.width * 0.1,
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white, // Màu nền cho hộp
                    borderRadius: BorderRadius.circular(100.0), // Bo góc
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.5), // Màu bóng
                        spreadRadius: 5,
                        blurRadius: 7,
                        offset: const Offset(0, 3), // Vị trí bóng
                      ),
                    ],
                  ),
                  child: RoundedInputFiled(
                    vertical: 0.0,
                    hintText: 'Tìm kiếm',
                    icon: Icons.search,
                    onChanged: _onSearchChanged,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 40.0),
          Expanded(
            child: _filteredSportTypes.isEmpty
                ? const Center(child: CircularProgressIndicator())
                : GridView.builder(
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      mainAxisSpacing: 10.0,
                      crossAxisSpacing: 10.0,
                      childAspectRatio: 1,
                    ),
                    itemCount: _filteredSportTypes.length,
                    itemBuilder: (context, index) {
                      return SportTypeItem(
                        size: size,
                        name: _filteredSportTypes[index].tenLoai,
                        sportType: _filteredSportTypes[index],
                      );
                    },
                    padding: const EdgeInsets.all(8.0),
                  ),
          ),
        ],
      ),
    );
  }
}
