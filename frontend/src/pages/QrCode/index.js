import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Navbar, Footer } from "../../components";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function QrCode({ navigation }) {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [contentModalVisible, setContentModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const qrCodeLock = useRef(false);

  async function handleOpenCam() {
    try {
      const { granted } = await requestPermission();
      if (!granted) {
        return Alert.alert("Câmera", "Você precisa habilitar o uso da câmera!");
      }
      setModalIsVisible(true);
      qrCodeLock.current = false;
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCopyToClipboard() {
    if (scannedData) {
      await Clipboard.setStringAsync(scannedData);
      Alert.alert("Copiado!", "O conteúdo foi copiado para a área de transferência.");
    }
  }

  function handleQRCodeRead(data) {
    setModalIsVisible(false);
    setScannedData(data);
    setContentModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Button title="Ler QR Code" onPress={handleOpenCam} />
        {/* Modal para a Câmera */}
        <Modal visible={modalIsVisible} animationType="slide">
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={(result) => {
              if (result && result.data && !qrCodeLock.current) {
                qrCodeLock.current = true;
                setTimeout(() => handleQRCodeRead(result.data), 500);
              }
            }}
          />
          <View style={styles.buttonView}>
            <Button title="Cancelar" onPress={() => setModalIsVisible(false)} />
          </View>
        </Modal>

        {/* Modal para Exibição do Conteúdo Lido */}
        <Modal visible={contentModalVisible} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.contentModal}>
              <Text style={styles.resultText}>Conteúdo do QR Code:</Text>
              <Text selectable style={styles.resultValue}>
                {scannedData}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleCopyToClipboard} style={styles.copyButton}>
                  <Text style={styles.copyButtonText}>Copiar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setContentModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
  },
  buttonView: {
    position: "absolute",
    bottom: 32,
    left: 32,
    right: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentModal: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  copyButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
