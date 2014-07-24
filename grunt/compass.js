module.exports = {
    "dev": {
        "options": {
            "sassDir": "<%= paths.src.css %>",
            "cssDir": "<%= paths.dest.css %>",
            "fontsDir": "<%= paths.dest.fonts %>",
            "fontsPath": "<%= paths.dest.fonts %>",
            "imagesDir": "<%= paths.dest.images %>",
            "relativeAssets": true,
            "sourcemap": true,
            "outputStyle": "compact",
            "require": [
                "toolkit",
                "breakpoint",
                "singularitygs",
                "modular-scale",
                "color-schemer",
                "sass-globbing"
            ]
        }
    }
};
