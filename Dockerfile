# n8n + EPUB generator container
FROM node:20-bullseye

# Install n8n CLI globally
RUN npm install -g n8n

# Install EPUB generation libs
RUN npm install -g epub-gen epub-gen-memory

# Install epubcheck for Apple Books validation
RUN apt-get update &&         apt-get install -y default-jdk-headless wget unzip &&         wget -q https://github.com/w3c/epubcheck/releases/download/v5.1.0/epubcheck-5.1.0.zip -O /tmp/epubcheck.zip &&         unzip -q /tmp/epubcheck.zip -d /opt &&         ln -s /opt/epubcheck-5.1.0/epubcheck.sh /usr/local/bin/epubcheck

# Copy custom script into image
COPY make-epub.js /data/scripts/make-epub.js

ENV PORT=5678
EXPOSE 5678

CMD ["n8n", "start"]