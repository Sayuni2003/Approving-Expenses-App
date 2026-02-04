import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";

const AddClaim = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [items, setItems] = useState([
    { label: "Travel", value: "Travel" },
    { label: "Meals & Food", value: "Meals & Food" },
    { label: "Internet & Mobile", value: "Internet & Mobile" },
    { label: "Accommodation", value: "Accommodation" },
    { label: "Office Supplies", value: "Office Supplies" },
    { label: "Software & Subscriptions", value: "Software & Subscriptions" },
    { label: "Equipment", value: "Equipment" },
    { label: "Training & Courses", value: "Training & Courses" },
    { label: "Medical", value: "Medical" },
    { label: "Courier", value: "Courier" },
    { label: "Miscellaneous", value: "Miscellaneous" },
  ]);

  //Receipt states
  const [receiptImage, setReceiptImage] = useState<{
    uri: string;
    name?: string;
    mimeType?: string;
  } | null>(null);

  const [receiptPdf, setReceiptPdf] = useState<{
    uri: string;
    name?: string;
    mimeType?: string;
    size?: number;
  } | null>(null);

  useEffect(() => {
    ImagePicker.requestCameraPermissionsAsync();
    ImagePicker.requestMediaLibraryPermissionsAsync();
  }, []);

  async function pickReceiptImage() {
    Alert.alert("Upload Receipt Photo", "Choose an option", [
      { text: "Camera", onPress: openCamera },
      { text: "Gallery", onPress: openGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  async function openCamera() {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setReceiptImage({
        uri: asset.uri,
        name: asset.fileName ?? "receipt.jpg",
        mimeType: asset.mimeType ?? "image/jpeg",
      });
    }
  }

  async function openGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setReceiptImage({
        uri: asset.uri,
        name: asset.fileName ?? "receipt.jpg",
        mimeType: asset.mimeType ?? "image/jpeg",
      });
    }
  }

  async function takeReceiptPhoto() {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setReceiptImage({
        uri: asset.uri,
        name: asset.fileName ?? "receipt.jpg",
        mimeType: asset.mimeType ?? "image/jpeg",
      });
    }
  }

  async function pickReceiptPdf() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    setReceiptPdf({
      uri: file.uri,
      name: file.name,
      mimeType: file.mimeType ?? "application/pdf",
      size: file.size,
    });
  }

  function handleSubmit() {
    // Later: upload receiptImage/receiptPdf to storage and save URLs in Firestore
    // For now: just go back
    router.back();
  }

  return (
    <ScrollView
      className="flex-1 bg-white p-4"
      nestedScrollEnabled
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text className="text-3xl font-bold text-primary mb-6 mt-5">
        Add New Claim
      </Text>

      <View className="bg-background rounded-xl p-4 space-y-4 mt-4 border border-white">
        <View>
          <Text className="text-primary font-semibold mb-2 mt-5">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., Internet Bill"
            className={`border border-gray-200 rounded-lg px-3 py-3 ${
              name ? "bg-white" : "bg-transparent"
            }`}
          />
        </View>

        <View>
          <Text className="text-primary font-semibold mb-2 mt-5">Category</Text>
          <DropDownPicker
            open={open}
            value={category}
            items={items}
            setOpen={setOpen}
            setValue={setCategory}
            setItems={setItems}
            placeholder="Select category"
            maxHeight={260}
            listMode="SCROLLVIEW"
            style={{ borderColor: "#e5e7eb" }}
            dropDownContainerStyle={{ borderColor: "#e5e7eb" }}
          />
        </View>

        <View>
          <Text className="text-primary font-semibold mb-2 mt-5">Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="e.g., 3500"
            keyboardType="numeric"
            className={`border border-gray-200 rounded-lg px-3 py-3 ${
              amount ? "bg-white" : "bg-transparent"
            }`}
          />
        </View>

        <View>
          <Text className="text-primary font-semibold mb-2 mt-5">
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Short note..."
            textAlignVertical="top"
            multiline
            className={`border border-gray-200 rounded-lg px-3 py-3 min-h-[90px] ${
              description ? "bg-white" : "bg-transparent"
            }`}
          />
        </View>

        {/* Upload section */}
        <View className="mt-5">
          <Text className="text-primary font-semibold mb-3 ">Receipt</Text>

          {/* Image picker */}
          <TouchableOpacity
            className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3"
            onPress={pickReceiptImage}
          >
            <Text className="text-primary font-semibold">
              Upload Photo (JPG/PNG)
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              Select a receipt image from gallery
            </Text>
          </TouchableOpacity>

          {receiptImage ? (
            <View className="mt-3">
              <Image
                source={{ uri: receiptImage.uri }}
                className="w-full h-40 rounded-lg"
                resizeMode="cover"
              />
              <View className="flex-row justify-between items-center mt-2">
                <Text
                  className="text-gray-600 text-xs flex-1"
                  numberOfLines={1}
                >
                  {receiptImage.name ?? receiptImage.uri}
                </Text>

                <TouchableOpacity onPress={() => setReceiptImage(null)}>
                  <Text className="text-red-600 font-semibold">Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {/* PDF picker */}
          <TouchableOpacity
            className="mt-4 bg-gray-100 border border-gray-200 rounded-lg px-4 py-3"
            onPress={pickReceiptPdf}
          >
            <Text className="text-primary font-semibold">Upload PDF</Text>
            <Text className="text-gray-500 text-xs mt-1">
              Select a receipt PDF from files
            </Text>
          </TouchableOpacity>

          {receiptPdf ? (
            <View className="mt-2 flex-row justify-between items-center">
              <Text className="text-gray-600 text-xs flex-1" numberOfLines={1}>
                {receiptPdf.name ?? receiptPdf.uri}
              </Text>

              <TouchableOpacity onPress={() => setReceiptPdf(null)}>
                <Text className="text-red-600 font-semibold">Remove</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <Text className="text-gray-400 text-xs mt-2">
            You can upload either photo or PDF.
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity
            className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
            onPress={() => router.back()}
          >
            <Text className="text-primary font-semibold">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-primary rounded-lg py-3 items-center"
            onPress={handleSubmit}
          >
            <Text className="text-white font-semibold">Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddClaim;
