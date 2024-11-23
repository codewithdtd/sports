import 'package:flutter/material.dart';
import 'package:mobile/models/rating_model.dart';
import 'package:mobile/services/review.dart';

class ReviewScreen extends StatefulWidget {
  const ReviewScreen({super.key});

  @override
  State<ReviewScreen> createState() => _ReviewScreenState();
}

class _ReviewScreenState extends State<ReviewScreen> {
  late Future<List<Rating>> futureList;
  String _selectedFilter = 'Tất cả'; // "Tất cả" là mặc định

  @override
  void initState() {
    super.initState();
    futureList = _fetchData();
  }

  Future<List<Rating>> _fetchData() async {
    try {
      final response = await ReviewService().getAll();
      final filteredData =
          response.where((rating) => rating.isHided == false).toList();

      // Đảo ngược danh sách sau khi lọc
      return filteredData.reversed.toList();
    } catch (error) {
      print('Lỗi khi lấy dữ liệu: $error');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể tải dữ liệu. Vui lòng thử lại sau.')),
      );
      return [];
    }
  }

  List<Rating> _filterRatings(List<Rating> ratings) {
    if (_selectedFilter == 'Tất cả') return ratings;
    return ratings.where((rating) => rating.rating == _selectedFilter).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Center(
          child: Text(
            'Đánh giá của khách hàng',
            style: TextStyle(fontWeight: FontWeight.w500, color: Colors.white),
          ),
        ),
        backgroundColor: Colors.greenAccent[700],
        automaticallyImplyLeading: false,
      ),
      body: Container(
        color: Colors.grey[300],
        child: Column(
          children: [
            // Thêm các nút lọc
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildFilterButton('Tất cả'),
                _buildFilterButton('Tốt'),
                _buildFilterButton('Tệ'),
              ],
            ),
            Expanded(
              child: FutureBuilder<List<Rating>>(
                future: futureList,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return const Center(
                        child: Text('Đã xảy ra lỗi khi tải dữ liệu'));
                  } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return const Center(child: Text('Không có dữ liệu'));
                  } else {
                    // Lọc danh sách dựa trên lựa chọn hiện tại
                    final list = _filterRatings(snapshot.data!);
                    return ListView.builder(
                      padding: const EdgeInsets.only(
                          left: 16.0, right: 16.0, bottom: 15.0),
                      itemCount: list.length,
                      itemBuilder: (context, index) {
                        final item = list[index];
                        return Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10.0, vertical: 15.0),
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
                          margin: const EdgeInsets.symmetric(vertical: 8.0),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              SizedBox(
                                height: 70,
                                width: 70,
                                child: ClipOval(
                                    child: Image.asset(
                                        'assets/images/avatar.jpg')),
                              ),
                              SizedBox(
                                width: 8.0,
                              ),
                              Expanded(
                                child: Stack(
                                  children: [
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          '${item.customer?.firstName} ${item.customer?.lastName}',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 17.0,
                                          ),
                                        ),
                                        Text('${item.createdAt}'),
                                        Text(
                                          '${item.content}',
                                          style: TextStyle(fontSize: 17.0),
                                          softWrap: true,
                                          overflow: TextOverflow.visible,
                                        ),
                                        if (item.feedback != null)
                                          Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                'Phản hồi',
                                                style: TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.grey[700],
                                                ),
                                              ),
                                              Text(
                                                '${item.feedback?.employee?.firstName} ${item.feedback?.employee?.lastName}',
                                                style: TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              Text(
                                                '${item.feedback?.createdAt}',
                                                style:
                                                    TextStyle(fontSize: 13.0),
                                              ),
                                              Text(
                                                '${item.feedback?.content}',
                                                style:
                                                    TextStyle(fontSize: 14.0),
                                              ),
                                            ],
                                          )
                                      ],
                                    ),
                                    Positioned(
                                      right: 0,
                                      child: Container(
                                        width: 40,
                                        height: 40,
                                        child: Icon(
                                          item.rating == 'Tốt'
                                              ? Icons
                                                  .sentiment_satisfied_outlined
                                              : Icons
                                                  .sentiment_dissatisfied_rounded,
                                          color: item.rating == 'Tốt'
                                              ? Colors.greenAccent[700]
                                              : Colors.red,
                                          size: 40.0,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Hàm để tạo nút lọc
  Widget _buildFilterButton(String filter) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 10.0),
      child: ElevatedButton(
        onPressed: () {
          setState(() {
            _selectedFilter = filter;
          });
        },
        style: ElevatedButton.styleFrom(
          primary: _selectedFilter == filter ? Colors.blue[400] : Colors.grey,
        ),
        child: Text(
          filter,
          style: TextStyle(color: Colors.white, fontSize: 16.0),
        ),
      ),
    );
  }
}
