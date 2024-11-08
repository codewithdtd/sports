import 'package:flutter/material.dart';
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
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Khách hàng: ${invoice.khachHang?.hoKh} ${invoice.khachHang?.tenKh}',
                          style: TextStyle(fontSize: 16.0),
                        ),
                        SizedBox(height: 6.0),
                        Text(
                          'Số điện thoại: ${invoice.khachHang?.sdtKh}',
                          style: TextStyle(fontSize: 16.0),
                        ),
                        SizedBox(height: 6.0),
                        Text(
                          'Email: ${invoice.khachHang?.emailKh}',
                          style: TextStyle(fontSize: 16.0),
                        ),
                        SizedBox(height: 6.0),
                        Text(
                          'Nhân viên: ${invoice.nhanVien?.hoNv} ${invoice.nhanVien?.tenNv}',
                          style: TextStyle(fontSize: 16.0),
                        ),
                        SizedBox(height: 6.0),
                        Text(
                          'Số điện thoại: ${invoice.nhanVien?.sdtNv}',
                          style: TextStyle(fontSize: 16.0),
                        ),
                        SizedBox(height: 6.0),
                        Text(
                          'Email: ${invoice.nhanVien?.emailNv}',
                          style: TextStyle(fontSize: 16.0),
                        ),
                        SizedBox(height: 6.0),
                        Text(
                          'Ngày tạo hóa đơn: ${invoice.ngayTaoHd}',
                          style: TextStyle(fontSize: 16.0),
                        ),
                        SizedBox(height: 6.0),
                        Text(
                          'Phương thức thanh toán: ${invoice.phuongThucThanhToan}',
                          style: TextStyle(fontSize: 16.0),
                        ),
                        SizedBox(height: 6.0),
                        Text(
                          'Check in: ${invoice.datSan?.thoiGianCheckIn}',
                          style: TextStyle(fontSize: 16.0),
                        ),
                        SizedBox(height: 6.0),
                        Text(
                          'Check out: ${invoice.datSan?.thoiGianCheckOut}',
                          style: TextStyle(fontSize: 16.0),
                        ),
                        SizedBox(height: 6.0),
                        Text(
                          'Tổng tiền: ${invoice.tongTien}',
                          style: TextStyle(fontSize: 16.0),
                        ),
                        SizedBox(height: 6.0),
                        Text(
                          'Ghi chú: ${invoice.ghiChu}',
                          style: TextStyle(fontSize: 16.0),
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
                          decoration: BoxDecoration(color: Colors.green[300]),
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text('Tên', textAlign: TextAlign.center),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child:
                                  Text('Số lượng', textAlign: TextAlign.center),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text('Giá', textAlign: TextAlign.center),
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
                                  '${invoice.datSan?.san?.bangGiaMoiGio}',
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
                                      child: Text('${dichVu.thanhTien}',
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
          );
        },
      ),
    );
  }
}
