# 1. Build the project
Write-Host "Building the project with Maven..." -ForegroundColor Green
./mvnw clean package -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Error "Maven build failed."
    exit 1
}

# 2. Define variables
$APP_NAME = "CMC_Management_System"
$APP_VERSION = "1.0.0"
$INPUT_DIR = "target"
$MAIN_JAR = "demo3-0.0.1-SNAPSHOT.jar"
$OUTPUT_DIR = "release"

# Ensure output directory exists
if (!(Test-Path $OUTPUT_DIR)) {
    New-Item -ItemType Directory -Force -Path $OUTPUT_DIR
}

# 3. Run jpackage
Write-Host "Creating portable app (Green Version) with jpackage..." -ForegroundColor Green

# Note: Changed to --type app-image to avoid WiX dependency.
# This creates a folder with the .exe and JRE, which we will zip.
jpackage `
  --name $APP_NAME `
  --app-version $APP_VERSION `
  --input $INPUT_DIR `
  --main-jar $MAIN_JAR `
  --type app-image `
  --dest $OUTPUT_DIR `
  --win-console `
  --description "Members of CMC Management System" `
  --java-options "-Dfile.encoding=UTF-8"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Portable app created in $OUTPUT_DIR\$APP_NAME" -ForegroundColor Green
    
    # 4. Copy external resources (data folder)
    if (Test-Path "data") {
        Write-Host "Copying data directory to release folder..." -ForegroundColor Cyan
        Copy-Item -Path "data" -Destination "$OUTPUT_DIR\$APP_NAME" -Recurse -Force
    }

    # Zip it for GitHub Release
    $ZIP_FILE = "$OUTPUT_DIR\$APP_NAME-$APP_VERSION.zip"
    Write-Host "Zipping for release: $ZIP_FILE" -ForegroundColor Cyan
    Compress-Archive -Path "$OUTPUT_DIR\$APP_NAME" -DestinationPath $ZIP_FILE -Force
    
    Write-Host "Success! Upload $ZIP_FILE to GitHub." -ForegroundColor Green
    Invoke-Item $OUTPUT_DIR
} else {
    Write-Error "jpackage failed."
    exit 1
}
