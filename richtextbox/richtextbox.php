<?php
    /**
     * Allows input elements of type text to be styled with a set of predefined tags.
     * 
     *
     * @package     RichTextbox
     * @author      Thomas Walker
     * @license     https://opensource.org/licenses/MIT  MIT License
     * @link        https://github.com/thomaswalker-dev/CouchCMS-RichTextbox
     * @version     1.0.0
     */

    namespace ThomasWalker\RichTextbox;

    if (!defined('K_COUCH_DIR')) die();

    use KUserDefinedField;

    class KRichTextbox extends KUserDefinedField {
        
        public function _render($input_name, $input_id, $extra='', $dynamic_insertion=0)
        {
            global $FUNCS;

            $FUNCS->render('richtextbox_assets');

            $html = '<input type="text" id="'.$input_id.'" name="'.$input_name.'" value="'.htmlentities($this->data).'" class="form-control text richtextbox" data-role="richtextbox">';

            if(!$dynamic_insertion)
            {
                $FUNCS->add_js("$('#".$input_id."').richtextbox();");
            }
            else
            {
                $html .= self::renderOnLoadScript($input_name, $input_id, "$('#$input_id').richtextbox();");
            }
            return $html;
        }

        public function store_posted_changes($post_val)
        {
            // Allow only a set of tags.
            $post_val = strip_tags(html_entity_decode($post_val), '<b><strong><i><em><u>');

            if($this->data != $post_val)
            {
                $this->data = $post_val;
                $this->modified = 1;
            }
        }

        static function register_renderables()
        {
            global $FUNCS;
            $FUNCS->register_render('richtextbox_assets', array('renderable'=>array('ThomasWalker\RichTextbox\KRichTextbox', 'render_richtextbox_assets')));
        }

        static function render_richtextbox_assets()
        {
            global $FUNCS;            

            $ADDON_URL = Manager::getConfig('ADDON_URL') . 'assets/';
            $CUSTOM_STYLES = Manager::getConfig('CUSTOM_STYLES');
            $CUSTOM_SCRIPTS = Manager::getConfig('CUSTOM_SCRIPTS');

            $FUNCS->load_js($ADDON_URL . 'richtextbox.js');
            $FUNCS->load_css($ADDON_URL . 'richtextbox.css');

            foreach ($CUSTOM_STYLES as $value)
            {
                $FUNCS->load_css($ADDON_URL . $value);
            }

            foreach ($CUSTOM_SCRIPTS as $value)
            {
                $FUNCS->load_js($ADDON_URL . $value);
            }
        }

        static function renderOnLoadScript($input_name, $input_id, $code)
        {
            return '
            <img src="' . K_SYSTEM_THEME_URL . 'assets/blank.gif" alt="" id="' . $input_id . '_dummyimg" onload="
                el=$(\'#' . $input_id . '_dummyimg\');

                if(!el.attr(\'idx\'))
                {
                    '.$code.'
                    el.css(\'display\', \'none\');
                }
            " />';
        }
    }

    class Manager {
        
        private $couch_version = '2.2.1';
        private $couch_build = '20190417';

        private static $instance;
        
        private $_CONFIG = [
            'ADDON_URL' => K_ADMIN_URL . 'addons/richtextbox/',
            'CUSTOM_STYLES' => [],
            'CUSTOM_SCRIPTS' => []
        ];

        public function __construct()
        {
            $this->populate_config();
        }

        public static function getConfig($item)
        {
            $instance = self::getInstance();

            $item = trim($item);
            if($item)
            {
                return $instance->_CONFIG[$item];
            }
        }

        public static function getInstance()
        {
            if (!self::$instance instanceof self) {
                self::$instance = new self();
            }
    
            return self::$instance;
        }

        private function populate_config()
        {
            $_CONFIG = array();
            $file = dirname(__FILE__).'/config.php';
            if(file_exists($file)) require_once($file);

            foreach($_CONFIG as $key => $value)
            {
                $this->_CONFIG[$key] = $value;
            }

            unset($_CONFIG);
        }
    }

    $FUNCS->register_udf('richtextbox', 'ThomasWalker\RichTextbox\KRichTextbox', 1);
    $FUNCS->add_event_listener('register_renderables', array('ThomasWalker\RichTextbox\KRichTextbox', 'register_renderables'));