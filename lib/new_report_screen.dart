import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
// import 'package:flutter_sound/public/flutter_sound_recorder.dart';
// import 'package:flutter_sound/flutter_sound.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:invera_hse/component/constant.dart';
import 'package:invera_hse/component/get_container.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';
import 'package:invera_hse/utils/route.dart';
import 'package:http/http.dart' as http;
// import 'package:permission_handler/permission_handler.dart';
import 'package:path_provider/path_provider.dart';

class NewReportScreen extends StatefulWidget {
  final String reportType;

  const NewReportScreen({super.key, this.reportType = "Hazard"});

  @override
  State<NewReportScreen> createState() => _NewReportScreenState();
}

class _NewReportScreenState extends State<NewReportScreen> {
  bool isLoading = false;
  bool showSecondPhase = false;
  bool isConverting = false;
  File? selectedImage;

  // FlutterSoundRecorder? _recorder; // object to manage recording
  bool isRecording = false; // Flag to check if recording is ongoing;
  String? _filePath; //path where the recorded file is saved
  String _transcription = "";

  @override
  void initState() {
    super.initState();
    // initializs recorded when the app Start
    // _initRecorder();
  }

  // Future<void> _initRecorder() async {
  //   _recorder = FlutterSoundRecorder();
  //   final status =
  //       await Permission.microphone.request(); // Request microphone access
  //   if (status != PermissionStatus.granted) {
  //     print(" Microphone permission not granted");
  //     throw Exception(
  //       ' Microphone permission not granted',
  //     ); // throw error if permission denied
  //   }
  //   print(" Microphone permission granted: $status");
  //   await _recorder!.openRecorder(); // open the recorder
  // }

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
    try {
      // await _recorder!.stopRecorder();
      // Longer delay to ensure file is completely written to disk
      await Future.delayed(const Duration(milliseconds: 1500));

      // Verify file exists before attempting transcription
      if (_filePath != null) {
        final file = File(_filePath!);
        if (await file.exists()) {
          final fileSize = await file.length();
          print("Audio file size: $fileSize bytes");
          if (fileSize > 0) {
            setState(() {
              isRecording = false;
              isConverting = true;
            });
            await _sendToWhisper(_filePath!);
          } else {
            throw Exception('Audio file is empty or not properly saved');
          }
        } else {
          throw Exception('Audio file does not exist at $_filePath');
        }
      } else {
        throw Exception('File path is null');
      }
    } catch (e) {
      print("Error stopping recording: $e");
      setState(() {
        _transcription = "Error: ${e.toString()}";
        isRecording = false;
        isConverting = false;
        isLoading = false;
        showSecondPhase = true;
      });
    }
  }

  Future<void> _sendToWhisper(String path) async {
    try {
      String token = apiKey;

      // Verify file exists and is readable
      final file = File(path);
      if (!await file.exists()) {
        throw Exception('Audio file not found at path: $path');
      }

      print("Sending audio file to Whisper API: $path");
      print("File size: ${await file.length()} bytes");

      // Check for network connectivity before attempting API call
      print("Checking network connectivity...");
      try {
        final result = await InternetAddress.lookup('google.com')
            .timeout(const Duration(seconds: 5));
        if (result.isEmpty || result[0].rawAddress.isEmpty) {
          throw Exception('No internet connection available');
        }
        print("Network connectivity confirmed");
      } on SocketException catch (_) {
        throw Exception(
            'Network Error: No internet connection. Please check your connection and try again.');
      }

      final request = http.MultipartRequest(
        'POST',
        Uri.parse('https://api.openai.com/v1/audio/transcriptions'),
      )
        ..headers['Authorization'] = 'Bearer $token'
        ..files.add(
          await http.MultipartFile.fromPath('file', path),
        )
        ..fields['model'] = 'whisper-1'
        ..fields['language'] = 'en';

      print("Sending request to OpenAI Whisper API...");
      final response = await request.send().timeout(
            const Duration(seconds: 60),
            onTimeout: () =>
                throw Exception('API request timed out after 60 seconds'),
          );

      print("Response status: ${response.statusCode}");
      final responseBody = await response.stream.bytesToString();
      print("Response body: $responseBody");

      if (response.statusCode == 200) {
        final decoded = json.decode(responseBody);
        print("Decoded response: $decoded");
        final text = decoded['text'] ?? "";
        print("Successfully transcribed: $text");

        setState(() {
          _transcription =
              text.isNotEmpty ? text : "No speech detected. Please try again.";
          isConverting = false;
          isLoading = false;
          showSecondPhase = true;
        });
      } else {
        print("API Error: ${response.statusCode}");
        final errorBody = json.decode(responseBody);
        final errorMessage = errorBody['error']?['message'] ?? 'Unknown error';
        throw Exception('API Error: $errorMessage');
      }
    } on SocketException catch (e) {
      print("Socket/Network error: $e");
      setState(() {
        _transcription =
            "Network Error: Cannot reach the server. Please check your internet connection.";
        isConverting = false;
        isLoading = false;
        showSecondPhase = true;
      });
    } on TimeoutException catch (e) {
      print("Timeout error: $e");
      setState(() {
        _transcription =
            "Request timed out. Please check your internet and try again.";
        isConverting = false;
        isLoading = false;
        showSecondPhase = true;
      });
    } catch (e) {
      print("Transcription error: $e");
      String errorMsg = e.toString();

      // Provide user-friendly error messages
      if (errorMsg.contains('Failed host lookup') ||
          errorMsg.contains('Failed to lookup')) {
        errorMsg =
            "Cannot reach OpenAI server. Please check your internet connection.";
      } else if (errorMsg.contains('Network Error')) {
        errorMsg =
            "Network error. Please check your internet connection and try again.";
      } else if (errorMsg.contains('timed out')) {
        errorMsg = "Request timed out. Please try recording again.";
      } else if (errorMsg.contains('No internet')) {
        errorMsg =
            "No internet connection detected. Please connect to the internet and try again.";
      } else if (errorMsg.contains('SocketException')) {
        errorMsg =
            "Connection failed. Please check your network and try again.";
      }

      setState(() {
        _transcription = errorMsg;
        isConverting = false;
        isLoading = false;
        showSecondPhase = true;
      });
    }
  }

  @override
  void dispose() {
    // _recorder?.closeRecorder();
    // _recorder = null;
    super.dispose();
  }

  void _handleRecordButtonTap() {
    // If image is selected and transcription is done, submit
    if (selectedImage != null && showSecondPhase && !isLoading) {
      // Navigate to success screen
      context.push(AppRoutes.successScreen);
      return;
    }

    // Toggle recording
    if (!isLoading) {
      // Start recording
      setState(() {
        isLoading = true;
      });
      _startRecording();
    } else if (isRecording) {
      // Stop recording
      _stopRecording();
    }
  }

  void _onImageSelected(File image) {
    setState(() {
      selectedImage = image;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            /// Fixed: Custom App Bar at top
            const CustomAppBar(),

            /// Flexible scrollable content area (middle)
            Expanded(
              child: Stack(
                children: [
                  /// Show either Loader or scrollable ContentBody
                  if (isLoading)
                    Center(
                      child: Loader(
                        isConverting: isConverting,
                      ),
                    )
                  else
                    SingleChildScrollView(
                      reverse:
                          true, // Content aligns to bottom, new content appears without scroll
                      child: ContentBody(
                        reportType: widget.reportType,
                        showFirstPhase: !showSecondPhase,
                        showSecondPhase: showSecondPhase,
                        onImageSelected: _onImageSelected,
                        transcription: _transcription,
                      ),
                    ),
                ],
              ),
            ),

            /// Fixed: AI Custom Button at bottom
            AICustomButton(
              onTap: _handleRecordButtonTap,
              icon: selectedImage != null && showSecondPhase && !isLoading
                  ? AppFilePaths.send
                  : (isLoading && isRecording
                      ? AppFilePaths.recording
                      : AppFilePaths.microphoneWhite),
              text: selectedImage != null && showSecondPhase && !isLoading
                  ? "Submit"
                  : (isLoading && isRecording
                      ? "Tap to end record"
                      : "Tap to record"),
            )
          ],
        ),
      ),
    );
  }
}

class CustomAppBar extends StatelessWidget {
  const CustomAppBar({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          InkWell(
              onTap: () => context.pop(),
              child: const Icon(
                Icons.arrow_back_ios_new_rounded,
                size: 20,
              )),
          getText(
              context: context,
              title: "New Report",
              fontSize: 16,
              weight: FontWeight.w500),
          const SizedBox()
        ],
      ),
    );
  }
}

class AICustomButton extends StatelessWidget {
  final String text;
  final String icon;
  final dynamic onTap;
  const AICustomButton(
      {super.key, required this.text, required this.icon, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(20),
      child: SizedBox(
        width: double.infinity,
        height: 48,
        child: Container(
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              gradient: const LinearGradient(
                colors: [AppColors.secondaryColor, AppColors.primaryColor],
              )),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: onTap,
              child: Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CommonImageView(
                      imagePath: icon,
                      height: 16,
                      width: 16,
                      fit: BoxFit.scaleDown,
                    ),
                    addHorizontalSpace(5),
                    Text(
                      text,
                      style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.white),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class Loader extends StatefulWidget {
  final bool isConverting;

  const Loader({super.key, this.isConverting = false});

  @override
  State<Loader> createState() => _LoaderState();
}

class _LoaderState extends State<Loader> {
  String guideText =
      "You can explain everything in detail.\nInclude location and what happened.";
  String description = "";

  @override
  void initState() {
    super.initState();

    if (!widget.isConverting) {
      Timer(const Duration(seconds: 3), () {
        if (mounted) {
          setState(() {
            guideText = "Listening...";
            description =
                "Speak clearly. You can describe the situation fully.";
          });
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.only(bottom: 100),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CommonImageView(
              imagePath: AppFilePaths.aiLoader,
              height: 177,
              width: 188,
              fit: BoxFit.scaleDown,
            ),
            addVerticalSpace(10),
            Column(
              children: [
                getText(
                    context: context,
                    textAlign: TextAlign.center,
                    title: widget.isConverting
                        ? "Converting speech to text..."
                        : guideText,
                    fontSize: 12,
                    weight: FontWeight.w400),
                if (!widget.isConverting) addVerticalSpace(5),
                if (!widget.isConverting)
                  getText(
                      context: context,
                      textAlign: TextAlign.center,
                      title: description,
                      fontSize: 12,
                      weight: FontWeight.w400,
                      color: AppColors.grey4),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class ContentBody extends StatefulWidget {
  final String reportType;
  final bool showFirstPhase;
  final bool showSecondPhase;
  final Function(File) onImageSelected;
  final String transcription;

  const ContentBody({
    super.key,
    this.reportType = "Hazard",
    this.showFirstPhase = true,
    this.showSecondPhase = false,
    required this.onImageSelected,
    this.transcription = "",
  });

  @override
  State<ContentBody> createState() => _ContentBodyState();
}

class _ContentBodyState extends State<ContentBody> {
  bool _showReportCategory = false;
  bool _showFirstPrompt = false;
  bool _showTranscription = false;
  bool _showSecondPrompt = false;
  bool _showAttachImage = false;

  @override
  void initState() {
    super.initState();
    _initializeSequence();
  }

  void _initializeSequence() {
    if (widget.showFirstPhase) {
      // First phase: Show ReportCategoryTag immediately, FirstPrompt after 3 seconds
      _showReportCategory = true;
      _showFirstPrompt = false;
      _showTranscription = false;
      _showSecondPrompt = false;
      _showAttachImage = false;

      Future.delayed(const Duration(seconds: 1), () {
        if (mounted && widget.showFirstPhase) {
          setState(() {
            _showFirstPrompt = true;
          });
        }
      });
    } else if (widget.showSecondPhase) {
      // Second phase: Show all previous content immediately, then SecondPrompt and AttachImageTag after 3 seconds
      _showReportCategory = true;
      _showFirstPrompt = true;
      _showTranscription = true;
      _showSecondPrompt = false;
      _showAttachImage = false;

      Future.delayed(const Duration(seconds: 1), () {
        if (mounted && widget.showSecondPhase) {
          setState(() {
            _showSecondPrompt = true;
            _showAttachImage = true;
          });
        }
      });
    }
  }

  @override
  void didUpdateWidget(ContentBody oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Reset sequence when phase changes
    if (oldWidget.showFirstPhase != widget.showFirstPhase ||
        oldWidget.showSecondPhase != widget.showSecondPhase) {
      _initializeSequence();
    }
  }

  bool _isTranscriptionError() {
    return widget.transcription.contains("Failed") ||
        widget.transcription == "Transcription Error";
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          /// Hazard tag
          if (_showReportCategory)
            AnimatedOpacityWidget(
              child: ReportCategoryTag(reportType: widget.reportType),
            ),

          /// Bot Message 1
          if (_showFirstPrompt)
            const AnimatedOpacityWidget(child: FirstPrompt()),

          /// Transcription tag or Error tag (appears in second phase)
          if (_showTranscription)
            if (_isTranscriptionError())
              AnimatedOpacityWidget(
                child: ErrorTranscriptionTag(
                  errorMessage: widget.transcription,
                ),
              )
            else
              AnimatedOpacityWidget(
                child: TranscriptionTag(
                  transcription: widget.transcription,
                ),
              ),

          /// Retry prompt after error
          if (_showTranscription && _isTranscriptionError())
            const AnimatedOpacityWidget(child: FirstPrompt()),

          /// Bot Message 2 (appears after 3 seconds in second phase)
          if (_showSecondPrompt && !_isTranscriptionError())
            const AnimatedOpacityWidget(child: SecondPrompt()),

          /// Attach Image tag (appears after 3 seconds in second phase)
          if (_showAttachImage && !_isTranscriptionError())
            AnimatedOpacityWidget(
              child: AttachImageTag(
                onImageSelected: widget.onImageSelected,
              ),
            ),
        ],
      ),
    );
  }
}

class AnimatedOpacityWidget extends StatefulWidget {
  final Widget child;

  const AnimatedOpacityWidget({super.key, required this.child});

  @override
  State<AnimatedOpacityWidget> createState() => _AnimatedOpacityWidgetState();
}

class _AnimatedOpacityWidgetState extends State<AnimatedOpacityWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _animation,
      child: widget.child,
    );
  }
}

class AttachImageTag extends StatefulWidget {
  final Function(File) onImageSelected;

  const AttachImageTag({
    super.key,
    required this.onImageSelected,
  });

  @override
  State<AttachImageTag> createState() => _AttachImageTagState();
}

class _AttachImageTagState extends State<AttachImageTag> {
  File? _selectedImage;
  final ImagePicker _imagePicker = ImagePicker();

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? image = await _imagePicker.pickImage(source: source);
      if (image != null) {
        setState(() {
          _selectedImage = File(image.path);
        });
        widget.onImageSelected(_selectedImage!);
      }
    } catch (e) {
      print('Error picking image: $e');
    }
  }

  void _showImageSourceDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Select Image Source'),
          content: const Text('Choose where to pick the image from'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                _pickImage(ImageSource.camera);
              },
              child: const Text('Camera'),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                _pickImage(ImageSource.gallery);
              },
              child: const Text('Gallery'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 40),
      child: Align(
        alignment: Alignment.centerRight,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 30),
              child: InkWell(
                onTap: _showImageSourceDialog,
                child: Container(
                  height: 117,
                  width: 117,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppColors.lightGrey5,
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: Center(
                    child: _selectedImage != null
                        ? ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.file(
                              _selectedImage!,
                              fit: BoxFit.cover,
                            ),
                          )
                        : CommonImageView(
                            imagePath: AppFilePaths.addImage,
                            height: 40,
                            width: 40,
                            fit: BoxFit.scaleDown,
                          ),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: getContainer(
                context: context,
                height: 45,
                width: 45,
                decorationColor: AppColors.lightOrange5,
                shape: BoxShape.circle,
                child: Center(
                  child: CommonImageView(
                    imagePath: AppFilePaths.profile2,
                    height: 26.64,
                    width: 26.64,
                    fit: BoxFit.scaleDown,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class SecondPrompt extends StatelessWidget {
  const SecondPrompt({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 40),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          getContainer(
            context: context,
            height: 45,
            width: 45,
            decorationColor: AppColors.lightGrey5,
            shape: BoxShape.circle,
            child: Center(
              child: CommonImageView(
                imagePath: AppFilePaths.bot,
                fit: BoxFit.scaleDown,
              ),
            ),
          ),

          const SizedBox(width: 8),

          /// Message Bubble
          Padding(
            padding: const EdgeInsets.only(top: 20),
            child: Container(
              width: MediaQuery.of(context).size.width * 0.65,
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: AppColors.lightGrey6,
                borderRadius: BorderRadius.only(
                    topRight: Radius.circular(18),
                    bottomLeft: Radius.circular(18),
                    bottomRight: Radius.circular(18)),
              ),
              child: const Text(
                "Upload picture for evidence",
                style: TextStyle(
                  fontSize: 15,
                  height: 1.5,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class TranscriptionTag extends StatelessWidget {
  final String transcription;

  const TranscriptionTag({
    super.key,
    this.transcription = "",
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 40),
      child: Align(
        alignment: Alignment.centerRight,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 30),
              child: Container(
                width: 274,
                padding:
                    const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                decoration: const BoxDecoration(
                  color: Color(0xffFF4B2B),
                  borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(18),
                      bottomLeft: Radius.circular(18),
                      bottomRight: Radius.circular(18)),
                ),
                child: Text(
                  transcription.isEmpty
                      ? "There was an incident this morning at the production site around 9:15 a.m. A worker slipped near the loading area because the floor was wet from a leaking pipe close to the storage section. There were no warning signs placed around the area at the time. The worker fell but did not sustain any serious injury, although first aid was provided immediately. The water had been dripping for some time before the incident happened. The area is frequently used by staff moving materials in and out of the warehouse. I believe the leak needs to be fixed urgently, and proper caution signs should be installed to prevent this from happening again. The specific location is near the rear entrance beside the packaging unit."
                      : transcription,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: getContainer(
                context: context,
                height: 45,
                width: 45,
                decorationColor: AppColors.lightOrange5,
                shape: BoxShape.circle,
                child: Center(
                  child: CommonImageView(
                    imagePath: AppFilePaths.profile2,
                    height: 26.64,
                    width: 26.64,
                    fit: BoxFit.scaleDown,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ErrorTranscriptionTag extends StatelessWidget {
  final String errorMessage;

  const ErrorTranscriptionTag({
    super.key,
    this.errorMessage = "Transcription failed",
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 40),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          getContainer(
            context: context,
            height: 45,
            width: 45,
            decorationColor: AppColors.lightGrey5,
            shape: BoxShape.circle,
            child: Center(
              child: CommonImageView(
                imagePath: AppFilePaths.bot,
                fit: BoxFit.scaleDown,
              ),
            ),
          ),

          const SizedBox(width: 8),

          /// Error Message Bubble
          Padding(
            padding: const EdgeInsets.only(top: 20),
            child: Container(
              width: MediaQuery.of(context).size.width * 0.65,
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: AppColors.lightGrey6,
                borderRadius: BorderRadius.only(
                    topRight: Radius.circular(18),
                    bottomLeft: Radius.circular(18),
                    bottomRight: Radius.circular(18)),
              ),
              child: Text(
                errorMessage,
                style: const TextStyle(
                  fontSize: 15,
                  height: 1.5,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class FirstPrompt extends StatelessWidget {
  const FirstPrompt({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 40),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          getContainer(
            context: context,
            height: 45,
            width: 45,
            decorationColor: AppColors.lightGrey5,
            shape: BoxShape.circle,
            child: Center(
              child: CommonImageView(
                imagePath: AppFilePaths.bot,
                fit: BoxFit.scaleDown,
              ),
            ),
          ),

          const SizedBox(width: 8),

          /// Message Bubble
          Padding(
            padding: const EdgeInsets.only(top: 20),
            child: Container(
              width: MediaQuery.of(context).size.width * 0.65,
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: AppColors.lightGrey6,
                borderRadius: BorderRadius.only(
                    topRight: Radius.circular(18),
                    bottomLeft: Radius.circular(18),
                    bottomRight: Radius.circular(18)),
              ),
              child: const Text(
                "Please describe what happened.\nTap the microphone and speak clearly.",
                style: TextStyle(
                  fontSize: 15,
                  height: 1.5,
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}

class ReportCategoryTag extends StatelessWidget {
  final String reportType;

  const ReportCategoryTag({
    super.key,
    this.reportType = "Hazard",
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 40),
      child: Align(
        alignment: Alignment.centerRight,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 30),
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                decoration: const BoxDecoration(
                  color: Color(0xffFF4B2B),
                  borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(18),
                      bottomLeft: Radius.circular(18),
                      bottomRight: Radius.circular(18)),
                ),
                child: Text(
                  reportType,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: getContainer(
                context: context,
                height: 45,
                width: 45,
                decorationColor: AppColors.lightOrange5,
                shape: BoxShape.circle,
                child: Center(
                  child: CommonImageView(
                    imagePath: AppFilePaths.profile2,
                    height: 26.64,
                    width: 26.64,
                    fit: BoxFit.scaleDown,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
