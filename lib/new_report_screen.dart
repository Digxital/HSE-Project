import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:invera_hse/component/custom_flush_bar.dart';
import 'package:invera_hse/component/get_container.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/error_model/error_model/data_error.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';
import 'package:invera_hse/utils/route.dart';
import 'package:invera_hse/view_model/report_view_model.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

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

  FlutterSoundRecorder? _recorder;
  bool isRecording = false;
  bool _recorderReady = false;
  String? _filePath;
  String _transcription = "";

  late stt.SpeechToText _speechToText;
  bool _isListening = false;

  // Safe mount flag: set false at the START of dispose() so async
  // callbacks (e.g. SpeechToText onError) never touch context/setState
  // after the widget tree has released this State.
  bool _isMounted = false;

  @override
  void initState() {
    super.initState();
    _isMounted = true;
    _initRecorder();
    _initSpeechToText();
  }

  Future<void> _initRecorder() async {
    try {
      _recorder = FlutterSoundRecorder();
      final status = await Permission.microphone.request();
      if (status != PermissionStatus.granted) {
        if (_isMounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Microphone permission not granted')),
          );
        }
        return;
      }

      await _recorder!.openRecorder();

      if (_isMounted) {
        setState(() {
          _recorderReady = true;
        });
      }
    } catch (e) {
      print('Error initializing recorder: $e');
      if (_isMounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error initializing recorder: $e')),
        );
      }
    }
  }

  Future<void> _initSpeechToText() async {
    try {
      _speechToText = stt.SpeechToText();
      bool available = await _speechToText.initialize(
        onError: (error) {
          print('Speech Recognition Error: $error');
          // Use _isMounted (not `mounted`) — safe to read after dispose()
          if (_isMounted) {
            setState(() {
              _isListening = false;
            });
          }
        },
        onStatus: (status) {
          print('Speech Status: $status');
        },
        debugLogging: true, // Enable debug logging
      );

      if (!available) {
        print('Speech to text not available on this device');
        if (_isMounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Speech recognition not available on this device'),
              duration: Duration(seconds: 3),
            ),
          );
        }
      } else {
        print('Speech recognition initialized successfully');
      }
    } catch (e) {
      print('Error initializing speech to text: $e');
    }
  }

  Future<void> _startRecording() async {
    print("startRecording called");
    if (!_recorderReady) {
      if (_isMounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Recorder is initializing. Please wait...')),
        );
        setState(() {
          isLoading = false;
        });
      }
      return;
    }

    try {
      if (isRecording) {
        return; // Already recording, prevent multiple starts
      }

      final directory = await getApplicationDocumentsDirectory();
      _filePath =
          '${directory.path}/recording_${DateTime.now().millisecondsSinceEpoch}.aac';

      // Ensure recorder is not already recording
      if (_recorder?.isStopped != true) {
        await _recorder?.stopRecorder();
        await Future.delayed(const Duration(milliseconds: 200));
      }

      await _recorder!.startRecorder(
        toFile: _filePath,
        codec: Codec.aacADTS,
      );

      if (_isMounted) {
        setState(() {
          isRecording = true;
        });
      }

      // Start listening to speech after a short delay
      await Future.delayed(const Duration(milliseconds: 500));
      await _startListening();
    } catch (e) {
      print('Error starting recording: $e');
      if (_isMounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error starting recording: $e')),
        );
      }
      if (_isMounted) {
        setState(() {
          isLoading = false;
          isRecording = false;
        });
      }
    }
  }

  Future<void> _startListening() async {
    print("startListening called");
    try {
      if (!_isListening && _speechToText.isAvailable) {
        if (_isMounted) {
          setState(() {
            _isListening = true;
            _transcription = ""; // Reset transcription
          });
        }

        // Start listening with Android-optimized settings
        _speechToText.listen(
          onResult: (result) {
            if (_isMounted) {
              setState(() {
                _transcription = result.recognizedWords;
                print("Transcription result: $_transcription");
                print("Is final: ${result.finalResult}");
                print("Confidence: ${result.confidence}");
              });
            }
          },
          onSoundLevelChange: (level) {
            print('Sound level: $level');
          },
          listenFor: const Duration(seconds: 30), // Shorter duration
          pauseFor:
              const Duration(seconds: 5), // Longer pause to allow speaking
          partialResults: true,
          cancelOnError: false,
          localeId: 'en_US',
        );

        print('Speech recognition started successfully');
      } else {
        print('Speech recognition not available or already listening');
      }
    } catch (e) {
      print('Error starting listening: $e');
      if (_isMounted) {
        setState(() {
          _isListening = false;
        });
        // Don't immediately set sample text - let the user try again
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Speech recognition failed to start: $e'),
            duration: const Duration(seconds: 3),
          ),
        );
      }
    }
  }

  // Stop recording audio
  Future<void> _stopRecording() async {
    print("stopRecording called");
    if (!isRecording) {
      return; // Not currently recording
    }

    try {
      await _recorder?.stopRecorder();
      await _speechToText.stop();

      if (_isMounted) {
        setState(() {
          isRecording = false;
          _isListening = false;
          showSecondPhase = true;
          isLoading = false;
        });
      }

      // Give speech recognition a moment to finalize results
      await Future.delayed(const Duration(milliseconds: 500));

      print('Final transcription: "$_transcription"');

      if (_transcription.isEmpty || _transcription.trim().isEmpty) {
        // Only fall back to sample text if we have no transcription at all
        print('No transcription received, using sample text');
        if (_isMounted) {
          setState(() {
            _transcription =
                "There was an incident this morning at the production site around 9:15 a.m. A worker slipped near the loading area because the floor was wet from a leaking pipe close to the storage section. There were no warning signs placed around the area at the time.";
          });
        }
        if (_isMounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                  'No speech detected. Using sample text. Please try again for accurate transcription.'),
              duration: Duration(seconds: 4),
            ),
          );
        }
      } else {
        // Show success message with transcription preview
        if (_isMounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                  'Transcription captured: ${_transcription.substring(0, (_transcription.length > 50 ? 50 : _transcription.length))}...'),
              duration: const Duration(seconds: 3),
            ),
          );
        }
      }
    } catch (e) {
      print('Error stopping recording: $e');
      if (_isMounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error stopping recording: $e')),
        );
      }
      if (_isMounted) {
        setState(() {
          isLoading = false;
          isRecording = false;
        });
      }
    }
  }

  @override
  void dispose() {
    // Mark as unmounted FIRST so any in-flight async callbacks
    // (e.g. SpeechToText onError fired after navigation) skip setState/context.
    _isMounted = false;
    try {
      // Stop speech recognition first
      if (_speechToText.isListening) {
        _speechToText.stop();
      }
      _speechToText.cancel();

      // Stop audio recorder
      if (_recorder != null) {
        if (_recorder!.isRecording) {
          _recorder?.stopRecorder();
        }
        _recorder?.closeRecorder();
      }
      _recorder = null;
    } catch (e) {
      print('Error during dispose: $e');
    }
    super.dispose();
  }

  void _handleRecordButtonTap() {
    // If image is selected and transcription is done, submit
    if (selectedImage != null && showSecondPhase && !isLoading) {
      // Navigate to success screen
      submitReport(context);
      return;
    }

    // Toggle recording
    if (!isLoading && !isRecording) {
      // Start recording
      setState(() {
        isLoading = true;
      });
      _startRecording();
    } else if (isRecording && isLoading) {
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
      backgroundColor: Theme.of(context).colorScheme.surface,
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

  void submitReport(BuildContext context, {email, password}) async {
    var data = {
      "recordType": "incident",
      "title": "medium Injury",
      "description": _transcription,
      "riskLevel": "low",
      "location": {
        "clientId": "6985cd674c8230bd3c317181",
        "siteId": "6985cdbb4c8230bd3c317185",
        "specificArea": "Entire Facility"
      },
      "eventDate": DateTime.now().toString().split(' ')[0],
      "eventTime": DateTime.now().toString().split(' ')[1].substring(0, 5),
      "peopleAffected": 1,
      "injuryDetails": _transcription,
      "equipmentInvolved": "None"
    };
    print("data: $data");
    final CustomFlushBar customFlushBar = CustomFlushBar();
    final reportViewModel =
        Provider.of<ReportViewModel>(context, listen: false);
    clearDataErrorMessage(reportViewModel);
    await reportViewModel.createReportData(data);

    Object? errorMessage = reportViewModel.dataError?.message;
    print("report-error-message: $errorMessage");
    if (errorMessage != null) {
      customFlushBar.showErrorFlushBar(
          title: 'Error occurred', body: errorMessage, context: context);
    } else {
      context.push(AppRoutes.successScreen);
    }

    clearDataErrorMessage(reportViewModel);
  }

  clearDataErrorMessage(dataViewModel) {
    DataError dataError = DataError(message: null);
    dataViewModel.setDataError(dataError);
    dataViewModel.dataError;
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
                    color: Theme.of(context).textTheme.bodyMedium?.color,
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
            // AnimatedOpacityWidget(
            //   child: ReportCategoryTag(reportType: widget.reportType),
            // ),

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
                    // color: AppColors.lightGrey5,
                    color: Theme.of(context).highlightColor,
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
                            color: Theme.of(context).colorScheme.onSurface,
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
              decoration: BoxDecoration(
                // color: AppColors.lightGrey6,
                color: Theme.of(context).highlightColor,
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
              decoration: BoxDecoration(
                color: Theme.of(context).highlightColor,
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
