import 'package:flutter/material.dart';
import 'package:dropdown_button2/dropdown_button2.dart';

class CustomDropdownButton2 extends StatefulWidget {
  final String hint;
  final String? value;
  final List<String> dropdownItems;
  final ValueChanged<String?>? onChanged;
  final DropdownButtonBuilder? selectedItemBuilder;
  final Alignment? hintAlignment;
  final Alignment? valueAlignment;
  final double? buttonHeight, buttonWidth;
  final EdgeInsetsGeometry? buttonPadding;
  final BoxDecoration? buttonDecoration;
  final int? buttonElevation;
  final Widget? icon;
  final double? iconSize;
  final Color? iconEnabledColor;
  final Color? iconDisabledColor;
  final double? itemHeight;
  final EdgeInsetsGeometry? itemPadding;
  final double? dropdownHeight, dropdownWidth;
  final EdgeInsetsGeometry? dropdownPadding;
  final BoxDecoration? dropdownDecoration;
  final int? dropdownElevation;
  final Radius? scrollbarRadius;
  final double? scrollbarThickness;
  final bool? scrollbarAlwaysShow;
  final Offset offset;

  const CustomDropdownButton2({
    required this.hint,
    required this.value,
    required this.dropdownItems,
    required this.onChanged,
    this.selectedItemBuilder,
    this.hintAlignment,
    this.valueAlignment,
    this.buttonHeight,
    this.buttonWidth,
    this.buttonPadding,
    this.buttonDecoration,
    this.buttonElevation,
    this.icon,
    this.iconSize,
    this.iconEnabledColor,
    this.iconDisabledColor,
    this.itemHeight,
    this.itemPadding,
    this.dropdownHeight,
    this.dropdownWidth,
    this.dropdownPadding,
    this.dropdownDecoration,
    this.dropdownElevation,
    this.scrollbarRadius,
    this.scrollbarThickness,
    this.scrollbarAlwaysShow,
    this.offset = const Offset(0, 0),
    Key? key,
  }) : super(key: key);

  @override
  State<CustomDropdownButton2> createState() => _CustomDropdownButton2State();
}

class _CustomDropdownButton2State extends State<CustomDropdownButton2> {
  @override
  Widget build(BuildContext context) {
    return DropdownButtonHideUnderline(
      child: DropdownButton2(
        //To avoid long text overflowing.
        isExpanded: true,
        hint: Container(
          alignment: widget.hintAlignment,
          child: Text(
            widget.hint,
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
            style: TextStyle(
              fontSize: 14,
              color: Theme.of(context).hintColor,
            ),
          ),
        ),
        value: widget.value,
        items: widget.dropdownItems
            .map((item) => DropdownMenuItem<String>(
                  value: item,
                  child: Container(
                    alignment: widget.valueAlignment,
                    child: Text(
                      item,
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                      style: const TextStyle(
                        fontSize: 14,
                      ),
                    ),
                  ),
                ))
            .toList(),
        onChanged: widget.onChanged,
        selectedItemBuilder: widget.selectedItemBuilder,
        buttonStyleData: ButtonStyleData(
          height: widget.buttonHeight ?? 40,
          width: widget.buttonWidth ?? 140,
          padding: widget.buttonPadding ??
              const EdgeInsets.only(left: 14, right: 14),
          decoration: widget.buttonDecoration ??
              BoxDecoration(
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: Colors.black45,
                ),
              ),
          elevation: widget.buttonElevation,
        ),
        iconStyleData: IconStyleData(
          icon: widget.icon ?? const Icon(Icons.arrow_forward_ios_outlined),
          iconSize: widget.iconSize ?? 12,
          iconEnabledColor: widget.iconEnabledColor,
          iconDisabledColor: widget.iconDisabledColor,
        ),
        dropdownStyleData: DropdownStyleData(
          //Max height for the dropdown menu & becoming scrollable if there are more items. If you pass Null it will take max height possible for the items.
          maxHeight: widget.dropdownHeight ?? 200,
          width: widget.dropdownWidth ?? 140,
          padding: widget.dropdownPadding,
          decoration: widget.dropdownDecoration ??
              BoxDecoration(
                borderRadius: BorderRadius.circular(14),
              ),
          elevation: widget.dropdownElevation ?? 8,
          //Null or Offset(0, 0) will open just under the button. You can edit as you want.
          offset: widget.offset,
          //Default is false to show menu below button
          isOverButton: false,
          scrollbarTheme: ScrollbarThemeData(
            radius: widget.scrollbarRadius ?? const Radius.circular(40),
            thickness: widget.scrollbarThickness != null
                ? MaterialStateProperty.all<double>(widget.scrollbarThickness!)
                : null,
            thumbVisibility: widget.scrollbarAlwaysShow != null
                ? MaterialStateProperty.all<bool>(widget.scrollbarAlwaysShow!)
                : null,
          ),
        ),
        menuItemStyleData: MenuItemStyleData(
          height: widget.itemHeight ?? 40,
          padding:
              widget.itemPadding ?? const EdgeInsets.only(left: 14, right: 14),
        ),
      ),
    );
  }
}
