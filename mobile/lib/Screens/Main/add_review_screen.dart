import 'package:flutter/material.dart';
import 'package:mobile/components/rounded_button.dart';
import 'package:mobile/contants.dart';
import 'package:mobile/models/booked_model.dart';
import 'package:mobile/models/rating_model.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/services/review.dart';
import 'package:mobile/stores/user_provider.dart';
import 'package:provider/provider.dart';

class AddRatingScreen extends StatefulWidget {
  final DatSan datSan;
  final bool view;
  final Rating? review;
  const AddRatingScreen({
    super.key,
    required this.datSan,
    this.view = false,
    this.review,
  });

  @override
  State<AddRatingScreen> createState() => _AddRatingScreenState();
}

class _AddRatingScreenState extends State<AddRatingScreen> {
  bool isSatisfied = true;
  late final User? user;
  late final String? token;
  TextEditingController _reviewController = TextEditingController();
  @override
  void initState() {
    super.initState();
    user = Provider.of<UserProvider>(context, listen: false)
        .user; // Lấy user trong initState
    token = Provider.of<UserProvider>(context, listen: false).token;
    if (widget.view) {
      _reviewController =
          TextEditingController(text: '${widget.review?.content}');
    }
  }

  Future<void> _submitReview() async {
    String satisfaction = isSatisfied ? "Tốt" : "Tệ";
    String reviewText = _reviewController.text;

    // final Rating feedback = {
    //   "danhGia": satisfaction,
    //   "noiDung": reviewText,
    //   "khachHang": user!.toJson(),
    //   "datSan": widget.datSan.toJson(),
    // };
    final Rating feedback = Rating(
      content: reviewText,
      customer: Customer.fromUser(user!),
      rating: satisfaction,
      datSan: widget.datSan,
    );

    final newFb = feedback.toJson();

    // Xử lý gửi đánh giá tại đây, ví dụ: gửi lên server
    try {
      final response = await ReviewService(token: token).createReview(newFb);
      print(response);
      _reviewController.clear();
      // ignore: use_build_context_synchronously, unnecessary_null_comparison
      if (response != null) {
        Navigator.of(context).pop(true);
      }
    } catch (e) {
      print('Có lỗi xảy ra: $e');
      // Bạn cũng có thể hiển thị SnackBar để báo lỗi
      // ignore: use_build_context_synchronously
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng thử lại sau.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Đánh giá"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Đánh giá sân sau khi sử dụng",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Text(
              '${widget.datSan.san?.tenSan!} - ${widget.datSan.san?.maSan!}',
              style: const TextStyle(
                fontSize: 18.0,
              ),
            ),
            if (!widget.view)
              Row(
                children: [
                  Expanded(
                    child: RadioListTile<bool>(
                      title: const Text("Tốt"),
                      value: true,
                      groupValue: isSatisfied,
                      activeColor: Colors.green,
                      onChanged: (value) {
                        setState(() {
                          isSatisfied = value!;
                        });
                      },
                    ),
                  ),
                  Expanded(
                    child: RadioListTile<bool>(
                      title: const Text("Tệ"),
                      value: false,
                      groupValue: isSatisfied,
                      activeColor: Colors.red,
                      onChanged: (value) {
                        setState(() {
                          isSatisfied = value!;
                        });
                      },
                    ),
                  ),
                ],
              ),
            if (widget.view)
              Container(
                height: 40,
                width: 80,
                decoration: BoxDecoration(
                  color: widget.review?.rating == 'Tốt'
                      ? Colors.greenAccent[700]
                      : Colors.red,
                  borderRadius: BorderRadius.circular(10.0),
                ),
                child: Center(
                  child: Text(
                    '${widget.review?.rating}',
                    style: const TextStyle(fontSize: 18.0, color: Colors.white),
                  ),
                ),
              ),
            const SizedBox(height: 16),
            TextField(
              controller: _reviewController,
              maxLines: 4,
              decoration: const InputDecoration(
                labelText: "Nội dung đánh giá",
                border: OutlineInputBorder(),
              ),
              readOnly: widget.view,
            ),
            const SizedBox(height: 16),
            if (!widget.view)
              Center(
                child: RoundedButton(
                    text: "Gửi",
                    press: () => _submitReview(),
                    color: dprimaryColor,
                    textColor: Colors.white),
              ),
          ],
        ),
      ),
    );
  }
}
