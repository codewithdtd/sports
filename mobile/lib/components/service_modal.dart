import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/booked_model.dart';

class ServiceSelectionSheet extends StatefulWidget {
  final List<DichVu> availableServices;
  final Function(List<DichVu>) onConfirm;

  const ServiceSelectionSheet({
    Key? key,
    required this.availableServices,
    required this.onConfirm,
  }) : super(key: key);

  @override
  _ServiceSelectionSheetState createState() => _ServiceSelectionSheetState();
}

class _ServiceSelectionSheetState extends State<ServiceSelectionSheet> {
  // Khởi tạo TextEditingController cho mỗi dịch vụ
  late Map<DichVu, TextEditingController> controllers;

  @override
  void initState() {
    super.initState();
    controllers = {
      for (var service in widget.availableServices)
        service:
            TextEditingController(text: service.soluong?.toString() ?? '0'),
    };
  }

  @override
  void dispose() {
    // Hủy bỏ controllers khi không cần thiết nữa
    controllers.values.forEach((controller) => controller.dispose());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    String formatCurrency(int? number) {
      final formatter = NumberFormat('#,##0', 'vi_VN');
      return formatter.format(number);
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(height: 10.0),
        Text(
          'Chọn dịch vụ bổ sung',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        ConstrainedBox(
          constraints: BoxConstraints(maxHeight: 300),
          child: SingleChildScrollView(
            child: Column(
              children: widget.availableServices.map((service) {
                return Column(
                  children: [
                    CheckboxListTile(
                      title: Text('${service.tenDv}'),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Số lượng: ${service.tonKho}'),
                          Text('Đơn giá: ${formatCurrency(service.gia)}'),
                        ],
                      ),
                      value: service.soluong != null && service.soluong! > 0,
                      onChanged: (bool? isChecked) {
                        setState(() {
                          if (isChecked ?? false) {
                            service.soluong = 1;
                            service.thanhTien = service.gia ?? 0;
                          } else {
                            service.soluong = 0;
                            service.thanhTien = 0;
                          }
                          controllers[service]!.text =
                              service.soluong.toString();
                        });
                      },
                      enabled: service.tonKho! > 0,
                    ),
                    if (service.soluong != null && service.soluong! > 0) ...[
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Số lượng:'),
                            SizedBox(
                              width: 50,
                              child: TextField(
                                controller: controllers[service],
                                keyboardType: TextInputType.number,
                                decoration: InputDecoration(
                                  border: OutlineInputBorder(),
                                  contentPadding: EdgeInsets.all(5),
                                ),
                                inputFormatters: [
                                  FilteringTextInputFormatter.digitsOnly,
                                  TextInputFormatter.withFunction(
                                    (oldValue, newValue) {
                                      int? parsedValue =
                                          int.tryParse(newValue.text);
                                      if (parsedValue != null &&
                                          parsedValue > (service.tonKho ?? 0)) {
                                        // Giữ giá trị cũ nếu lớn hơn tonKho
                                        return oldValue;
                                      }
                                      return newValue;
                                    },
                                  ),
                                ],
                                onChanged: (value) {
                                  setState(() {
                                    service.soluong = int.tryParse(value) ?? 1;
                                    service.thanhTien =
                                        (service.gia ?? 0) * service.soluong!;
                                  });
                                },
                              ),
                            ),
                            Text(
                                '${formatCurrency(service.thanhTien).toString()} VND'),
                          ],
                        ),
                      ),
                      SizedBox(height: 10),
                    ],
                  ],
                );
              }).toList(),
            ),
          ),
        ),
        ElevatedButton(
          onPressed: () {
            List<DichVu> selectedServices = widget.availableServices
                .where((service) =>
                    service.soluong != null && service.soluong! > 0)
                .toList();
            widget.onConfirm(selectedServices);
            Navigator.pop(context);
          },
          child: Text(
            'Xác nhận',
            style: TextStyle(color: Colors.white, fontSize: 16.0),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.greenAccent[700],
            padding: EdgeInsets.symmetric(
              horizontal: MediaQuery.of(context).size.width * 0.4,
            ),
          ),
        ),
      ],
    );
  }
}
