use cc;

fn main() {
    cc::Build::new()
        .file("library_messages.c")
        .compile("library_messages");
    println!("cargo:rustc-link-lib=jack");
    println!("cargo:rustc-link-lib=asound");
}
