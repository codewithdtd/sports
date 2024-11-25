import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/booked_model.dart';
import 'package:mobile/models/invoice_model.dart';
import 'package:mobile/services/invoice.dart';
import 'package:mobile/stores/user_provider.dart';
import 'package:provider/provider.dart';

class OrderScreen extends StatefulWidget {
  final DatSan datSan;
  const OrderScreen({
    super.key,
    required this.datSan,
  });

  @override
  State<OrderScreen> createState() => _OrderScreenState();
}

class _OrderScreenState extends State<OrderScreen> {
  late Future<Invoice> futureInvoice;

  @override
  void initState() {
    super.initState();
    futureInvoice = _fetchInvoice();
  }

  Future<Invoice> _fetchInvoice() async {
    final String? token =
        Provider.of<UserProvider>(context, listen: false).token;
    return await InvoiceService(token: token).getOne('${widget.datSan.id}');
  }

  String formatCurrency(int? number) {
    final formatter = NumberFormat('#,##0', 'vi_VN');
    return formatter.format(number);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Chi tiết'),
      ),
      body: FutureBuilder<Invoice>(
        future: futureInvoice,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Có lỗi xảy ra: ${snapshot.error}'));
          } else if (!snapshot.hasData) {
            return Center(child: Text('Không có dữ liệu hóa đơn'));
          }

          final invoice = snapshot.data!;

          return SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(10.0),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  // border: Border.all(color: Colors.black87),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey
                          .withOpacity(1.0), // Màu bóng với độ trong suốt
                      spreadRadius: 5, // Mức độ lan rộng của bóng
                      blurRadius: 7, // Độ mờ của bóng
                      offset: Offset(0, 3), // Độ lệch của bóng theo trục x và y
                    ),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Center(
                              child: Text(
                                "CHI TIẾT ĐẶT SÂN",
                                style: TextStyle(
                                    color: Colors.greenAccent[700],
                                    fontSize: 24.0,
                                    fontWeight: FontWeight.bold),
                              ),
                            ),
                            SizedBox(height: 6.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Khách hàng: ',
                                  style: TextStyle(
                                    fontSize: 16.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '${invoice.khachHang?.hoKh} ${invoice.khachHang?.tenKh}',
                                  style: TextStyle(fontSize: 16.0),
                                ),
                              ],
                            ),
                            SizedBox(height: 6.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Số điện thoại: ',
                                  style: TextStyle(
                                    fontSize: 16.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '${invoice.khachHang?.sdtKh}',
                                  style: TextStyle(fontSize: 16.0),
                                ),
                              ],
                            ),
                            SizedBox(height: 6.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'Email: ',
                                  style: TextStyle(
                                      fontSize: 16.0,
                                      fontWeight: FontWeight.bold),
                                ),
                                Text(
                                  '${invoice.khachHang?.emailKh}',
                                  style: TextStyle(fontSize: 16.0),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'Nhân viên: ',
                                  style: TextStyle(
                                    fontSize: 16.0,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                                Text(
                                  '${invoice.nhanVien?.hoNv} ${invoice.nhanVien?.tenNv}',
                                  style: TextStyle(fontSize: 16.0),
                                ),
                              ],
                            ),
                            SizedBox(height: 6.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'Số điện thoại: ',
                                  style: TextStyle(
                                    fontSize: 16.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '${invoice.nhanVien?.sdtNv}',
                                  style: TextStyle(fontSize: 16.0),
                                ),
                              ],
                            ),
                            SizedBox(height: 6.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'Email: ',
                                  style: TextStyle(
                                    fontSize: 16.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '${invoice.nhanVien?.emailNv}',
                                  style: TextStyle(fontSize: 16.0),
                                ),
                              ],
                            ),
                            SizedBox(height: 6.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Ngày tạo hóa đơn: ',
                                  style: TextStyle(
                                    fontSize: 16.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '${invoice.ngayTaoHd}',
                                  style: TextStyle(fontSize: 16.0),
                                ),
                              ],
                            ),
                            SizedBox(height: 6.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Phương thức thanh toán: ',
                                  style: TextStyle(
                                    fontSize: 16.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '${invoice.phuongThucThanhToan}',
                                  style: TextStyle(fontSize: 16.0),
                                ),
                              ],
                            ),
                            SizedBox(height: 6.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      'Check in: ',
                                      style: TextStyle(
                                        fontSize: 16.0,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      '${invoice.datSan?.thoiGianCheckIn}',
                                      style: TextStyle(
                                        fontSize: 16.0,
                                      ),
                                    ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    Text(
                                      'Check out: ',
                                      style: TextStyle(
                                        fontSize: 16.0,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      '${invoice.datSan?.thoiGianCheckOut}',
                                      style: TextStyle(
                                        fontSize: 16.0,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            if (invoice.phuThu != null)
                              SizedBox(
                                height: 6.0,
                              ),
                            if (invoice.phuThu != null)
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Phụ thu: ',
                                    style: TextStyle(
                                      fontSize: 16.0,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    '${formatCurrency(invoice.phuThu)}',
                                    style: TextStyle(fontSize: 16.0),
                                  ),
                                ],
                              ),
                            SizedBox(height: 6.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Tổng tiền: ',
                                  style: TextStyle(
                                    fontSize: 16.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '${formatCurrency(invoice.tongTien)}',
                                  style: TextStyle(fontSize: 16.0),
                                ),
                              ],
                            ),
                            SizedBox(height: 6.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Tổng tiền phải trả: ',
                                  style: TextStyle(
                                    fontSize: 16.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                if (invoice.phuThu != null)
                                  Text(
                                    '${formatCurrency(invoice.tongTien! + invoice.phuThu!)}',
                                    style: TextStyle(fontSize: 16.0),
                                  ),
                                if (invoice.phuThu == null)
                                  Text(
                                    '${formatCurrency(invoice.tongTien)}',
                                    style: TextStyle(fontSize: 16.0),
                                  ),
                              ],
                            ),
                            SizedBox(height: 6.0),
                            Row(
                              children: [
                                Text(
                                  'Ghi chú: ',
                                  style: TextStyle(
                                    fontSize: 16.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                if (invoice.ghiChu != null)
                                  Text(
                                    '${invoice.ghiChu}',
                                    style: TextStyle(fontSize: 16.0),
                                  ),
                              ],
                            ),
                            SizedBox(height: 6.0),
                          ],
                        ),
                      ),
                      Container(
                        margin: EdgeInsets.only(top: 16),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.black),
                        ),
                        child: Table(
                          border: TableBorder.all(),
                          columnWidths: const {
                            0: FlexColumnWidth(2),
                            1: FlexColumnWidth(3),
                            2: FlexColumnWidth(2),
                          },
                          children: [
                            TableRow(
                              decoration:
                                  BoxDecoration(color: Colors.green[300]),
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Text(
                                    'Tên',
                                    textAlign: TextAlign.center,
                                    style:
                                        TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Text(
                                    'Số lượng',
                                    textAlign: TextAlign.center,
                                    style:
                                        TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Text(
                                    'Giá',
                                    textAlign: TextAlign.center,
                                    style:
                                        TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ],
                            ),
                            TableRow(
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Text('${invoice.datSan?.san?.maSan}',
                                      textAlign: TextAlign.center),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Text(
                                    '${invoice.datSan?.thoiGianBatDau}-${invoice.datSan?.thoiGianKetThuc}',
                                    textAlign: TextAlign.center,
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Text(
                                      '${formatCurrency(invoice.datSan?.san?.bangGiaMoiGio)}',
                                      textAlign: TextAlign.center),
                                ),
                              ],
                            ),
                            if (invoice.datSan?.dichVu != null)
                              ...invoice.datSan!.dichVu!
                                  .map(
                                    (dichVu) => TableRow(
                                      children: [
                                        Padding(
                                          padding: const EdgeInsets.all(8.0),
                                          child: Text('${dichVu.tenDv}',
                                              textAlign: TextAlign.center),
                                        ),
                                        Padding(
                                          padding: const EdgeInsets.all(8.0),
                                          child: Text('${dichVu.soluong}',
                                              textAlign: TextAlign.center),
                                        ),
                                        Padding(
                                          padding: const EdgeInsets.all(8.0),
                                          child: Text(
                                              '${formatCurrency(dichVu.thanhTien)}',
                                              textAlign: TextAlign.center),
                                        ),
                                      ],
                                    ),
                                  )
                                  .toList(),
                          ],
                        ),
                      ),
                      SizedBox(
                        height: 8.0,
                      ),
                      Center(
                        child: Text('Dsport cảm ơn quý khách'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
