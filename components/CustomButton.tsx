import { TouchableOpacity, Text, View } from "react-native";

import { ButtonProps } from "@/types/type";
import { moderateScale } from "react-native-size-matters";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "secondary":
      return "bg-gray-500";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border-neutral-300 border-[0.5px]";
    default:
      return "bg-[#47734D]";
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-black";
    case "secondary":
      return "text-[#2D6936]";
    case "danger":
      return "text-red-100";
    case "success":
      return "text-green-100";
    default:
      return "text-white";
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  className,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
    onPress={onPress}
    className={`w-full flex-row justify-center items-center shadow-md shadow-neutral-400/70 ${getBgVariantStyle(bgVariant)} ${className}`}
    style={{
      borderRadius: moderateScale(16),  // rounded-2xl
      padding: moderateScale(12),  // p-3
      shadowRadius: moderateScale(4),
    }}
    {...props}
  >
    {IconLeft && <View style={{ marginRight: moderateScale(8) }}>{<IconLeft />}</View>}
    <Text 
      className={`${getTextVariantStyle(textVariant)}`}
      style={{ fontSize: moderateScale(18), fontWeight: "bold" }} // text-lg font-bold
    >
      {title}
    </Text>
    {IconRight && <View style={{ marginLeft: moderateScale(8) }}>{<IconRight />}</View>}
  </TouchableOpacity>
  );
};

export default CustomButton;