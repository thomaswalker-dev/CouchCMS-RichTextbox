# RichTextbox
This CouchCMS addon allows input elements of type text to be styled using a set of predefined tags.

## Installation

 1. Download or clone this repository.
 2. Place the *"richtextbox"* folder within your CouchCMS addons folder located in "*couch/addons*".
 3. Open the "*couch/addons/kfunctions.php*" file. If it's not present, rename the 'kfunctions.example.php' file found in the same folder to 'kfunctions.php'.
 4. Add the following line of code to the "*couch/addons/kfunctions.php*" file:
`require_once(K_COUCH_DIR . 'addons/richtextbox/richtextbox.php');`

## Configuration

The configuration file is located in  the root folder of the addon.

    $_CONFIG = [
	    'ADDON_URL' => K_ADMIN_URL . 'addons/richtextbox/',
	    'CUSTOM_STYLES' => [],
	    'CUSTOM_SCRIPTS' => []
    ];

 - **ADDON_URL:** In case you place your addons in a different folder, this options allows you set correct path.
 - **CUSTOM_STYLES:** To customize the css style, you can either edit the source code, or create a custom css file and add it to the array.
 -  **CUSTOM_SCRIPTS:** Similar behaviour as "*CUSTOM_STYLES*". Use this option to include custom scripts.

## Preview
![preview1](https://user-images.githubusercontent.com/55230378/66451243-f074e300-ea31-11e9-9049-58f2f20c8252.png)