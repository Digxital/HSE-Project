import 'dart:convert';

import 'package:flutter/material.dart';
// import 'package:flutter_sound/flutter_sound.dart';
import 'package:invera_hse/component/constant.dart';
import 'package:path_provider/path_provider.dart';
import 'package:http/http.dart' as http;
// import 'package:permission_handler/permission_handler.dart';
// import 'package:loading_animation_widget/loading_animation_widget.dart';

class CreateReportScreen extends StatefulWidget {
  const CreateReportScreen({super.key});

  @override
  State<CreateReportScreen> createState() => _CreateReportScreenState();
}

class _CreateReportScreenState extends State<CreateReportScreen> {
  // FlutterSoundRecorder? _recorder; // object to manage recording
  bool isRecording = false; // Flag to check if recording is ongoing;
  String? _filePath; //path where the recorded file is saved
  String _transcription = "";
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    // initializs recorded when the app Start
    _initRecorder();
  }

  Future<void> _initRecorder() async {
    // _recorder = FlutterSoundRecorder();
    // final status =
    //     await Permission.microphone.request(); // Request microphone access
    // if (status != PermissionStatus.granted) {
    //   print(" Microphone permission not granted");
    //   throw Exception(
    //     ' Microphone permission not granted',
    //   ); // throw error if permission denied
    // }
    // print(" Microphone permission granted: $status");
    // await _recorder!.openRecorder(); // open the recorder
  }

  //Start Recording audio
  Future<void> _startRecording() async {
    final tempDir = await getTemporaryDirectory(); // Get temporary directory
    _filePath =
        '${tempDir.path}/recording.m4a'; //Set file path for saving recording
    print("Recording file path: $_filePath");

    // await _recorder!.startRecorder(toFile: _filePath, codec: Codec.aacMP4);

    setState(() {
      isRecording = true;
      _transcription = "";
    });
  }

  // Stop recording audio

  Future<void> _stopRecording() async {
    await Future.delayed(
      const Duration(milliseconds: 500),
    ); // Small delay to ensure file save correctly
    // await _recorder!.stopRecorder();
    setState(() {
      isRecording = false; //update recording status to false
    });
    if (_filePath != null) {
      // if exists, send it for transcription
      await _sendToWhisper(_filePath!);
    }
  }

  //
  Future<void> _sendToWhisper(String path) async {
    setState(() {
      _isLoading = true;
    });
    String token = apiKey;
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('https://api.openai.com/v1/audio/transcriptions'),
    )
      ..headers['Authorization'] = 'Bearer $token'
      ..files.add(
        await http.MultipartFile.fromPath('file', path),
      ) // Add recorded File
      ..fields['model'] = 'whisper-1' //Using whisper model
      ..fields['language'] = 'en'; //Specify English language
    try {
      final response = await request.send(); // Sent HTTP request
      print("Response status: ${response.statusCode}");
      final responseBody =
          await response.stream.bytesToString(); // Get response body as String
      print("Response body: $responseBody");
      final decoded = json.decode(responseBody);
      print("Decoded response: $decoded");
      print("Decoded text: ${decoded['text']}");
      setState(() {
        _transcription = decoded['text'] ?? "Transcription Error";
        print("Transcription result: $_transcription");
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _transcription = "Failed to transcribe. try again.";
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    // _recorder?.closeRecorder();
    // _recorder = null;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: const Color(0XFF962611),
        foregroundColor: Colors.white,
        title: const Text("Voice-To-Speech Model"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            const SizedBox(height: 10),
            Expanded(
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                    color: const Color.fromARGB(255, 14, 14, 14),
                    borderRadius: BorderRadius.circular(20)),
                // child: Center(
                //   child: _isLoading
                //       ? LoadingAnimationWidget.threeRotatingDots(
                //           color: Colors.blue, size: 60)
                //       : Text(
                //           _transcription == ""
                //               ? "Transcription goes here..."
                //               : _transcription,
                //           textAlign: TextAlign.center,
                //           style: const TextStyle(
                //               fontSize: 16, color: Colors.white),
                //         ),
                // )
              ),
            ),
            const SizedBox(height: 10),
            Container(
                width: double.infinity,
                height: 100,
                decoration: BoxDecoration(
                    color: const Color.fromARGB(255, 14, 14, 14),
                    borderRadius: BorderRadius.circular(20)),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          _transcription = "";
                        });
                      },
                      child: Container(
                        height: 50,
                        width: 50,
                        decoration: BoxDecoration(
                            color: const Color.fromARGB(255, 29, 28, 28),
                            borderRadius: BorderRadius.circular(30)),
                        child: const Center(
                          child: Icon(
                            Icons.clear_all_outlined,
                            color: Color.fromARGB(255, 115, 115, 115),
                            size: 28,
                          ),
                        ),
                      ),
                    ),
                    // isRecording
                    //     ? SizedBox(
                    //         height: 20,
                    //         child: LoadingAnimationWidget.threeRotatingDots(
                    //             color: Colors.blue, size: 60))
                    //     :
                    GestureDetector(
                      onTap: () {
                        isRecording ? _stopRecording() : _startRecording();
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(5.0),
                        child: Container(
                          height: 80,
                          width: 80,
                          decoration: BoxDecoration(
                              color: const Color(0XFF962611),
                              borderRadius: BorderRadius.circular(300)),
                          child: Icon(
                            isRecording ? Icons.mic : Icons.mic_off,
                            color: Colors.white,
                            size: 28,
                          ),
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        isRecording ? _stopRecording() : _startRecording();
                      },
                      child: Container(
                        height: 50,
                        width: 50,
                        decoration: BoxDecoration(
                            color: isRecording
                                ? const Color(0XFF962611)
                                : const Color.fromARGB(255, 29, 28, 28),
                            borderRadius: BorderRadius.circular(30)),
                        child: Icon(
                          isRecording ? Icons.stop : Icons.pause,
                          color: isRecording
                              ? Colors.white
                              : const Color.fromARGB(255, 115, 115, 115),
                          size: 28,
                        ),
                      ),
                    )
                  ],
                )),
          ],
        ),
      ),
    );
  }
}
