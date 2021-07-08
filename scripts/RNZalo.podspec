
Pod::Spec.new do |s|
  s.name         = "RNZalo"
  s.version      = "1.0.0"
  s.summary      = "RNZalo"
  s.description  = "Des"
  s.homepage     = "https://google.com"
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "8.0"
  s.source       = { :git => "https://github.com/phithu/rn-zalo.git", :tag => "master" }
  s.source_files  = "ios/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  s.dependency "ZaloSDK"

end

  