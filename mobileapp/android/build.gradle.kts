// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        google()
        mavenCentral()
        // Add JCenter as a simple Maven repository with HTTP URL to work around the deprecated jcenter() call
        maven {
            url = uri("https://pkgs.dev.azure.com/MicrosoftDeviceSDK/DuoSDK-Public/_packaging/Duo-SDK-Feed/maven/v1")
            name = "Duo-SDK-Feed"
        }
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.9.1")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:2.1.0")
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        // Add JCenter here too for all subprojects, including msal_flutter
        maven {
            url = uri("https://jcenter.bintray.com/")
        }
    }
}

// Convert string paths to File objects
rootProject.buildDir = File("../build")

subprojects {
    project.buildDir = File("${rootProject.buildDir}/${project.name}")
}

subprojects {
    project.evaluationDependsOn(":app")
}

tasks.register<Delete>("clean") {
    delete(rootProject.buildDir)
}