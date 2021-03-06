describe "pages" do
  include Rack::Test::Methods

  def app
    JekyllAdmin::Server
  end

  before(:each) do
    JekyllAdmin.site.process
  end

  after(:each) do
    JekyllAdmin.site.process
  end

  context "page index" do
    it "lists pages" do
      get "/pages"
      expect(last_response).to be_ok
      expect(last_response_parsed.last["name"]).to eq("page.md")
    end

    it "includes front matter defaults" do
      get "/pages"
      expect(last_response).to be_ok
      expect(last_response_parsed.first).to have_key("some_front_matter")
    end

    it "doesn't include the raw front matter" do
      get "/pages"
      expect(last_response).to be_ok
      expect(last_response_parsed.first).to_not have_key("front_matter")
    end

    it "doesn't include the page content" do
      get "/pages"
      expect(last_response).to be_ok
      expect(last_response_parsed.first).to_not have_key("content")
      expect(last_response_parsed.first).to_not have_key("raw_content")
    end
  end

  context "getting a single page" do
    it "returns a page" do
      get "/pages/page.md"
      expect(last_response).to be_ok
      expect(last_response_parsed["foo"]).to eq("bar")
    end

    it "returns the rendered output" do
      get "/pages/page.md"
      expect(last_response).to be_ok
      expected = "<h1 id=\"test-page\">Test Page</h1>\n"
      expect(last_response_parsed["content"]).to eq(expected)
    end

    it "returns the raw content" do
      get "/pages/page.md"
      expect(last_response).to be_ok
      expect(last_response_parsed["raw_content"]).to eq("# Test Page\n")
    end

    context "front matter" do
      let(:front_matter) { last_response_parsed["front_matter"] }

      it "contains front matter defaults" do
        get "/pages/page.md"
        expect(last_response_parsed.key?("some_front_matter")).to eql(true)
      end

      it "contains raw front matter" do
        get "/pages/page.md"
        expect(last_response_parsed.key?("front_matter")).to eql(true)
        expect(front_matter["foo"]).to eql("bar")
      end

      it "raw front matter doesn't include defaults" do
        get "/pages/page.md"
        expect(front_matter.key?("some_front_matter")).to eql(false)
      end
    end

    it "404s for an unknown page" do
      get "/pages/foo.md"
      expect(last_response.status).to eql(404)
    end
  end

  it "writes a new page without front matter" do
    delete_file "page-new.md"

    request = {
      :front_matter => {},
      :raw_content  => "test"
    }
    put "/pages/page-new.md", request.to_json

    expect(last_response).to be_ok
    expect("page-new.md").to be_an_existing_file

    delete_file "page-new.md"
  end

  it "writes a new page with front matter" do
    delete_file "page-new.md"

    request = {
      :front_matter => { :foo => "bar" },
      :raw_content  => "test"
    }
    put "/pages/page-new.md", request.to_json

    expect(last_response).to be_ok
    expect(last_response_parsed["foo"]).to eq("bar")
    expect("page-new.md").to be_an_existing_file

    delete_file "page-new.md"
  end

  it "updates a page" do
    write_file "page-update.md"

    request = {
      :front_matter => { :foo => "bar2" },
      :raw_content  => "test"
    }
    put "/pages/page-update.md", request.to_json
    expect("page-update.md").to be_an_existing_file

    expect(last_response).to be_ok
    expect(last_response_parsed["foo"]).to eq("bar2")

    delete_file "page-update.md"
  end

  it "renames a page" do
    write_file  "page-rename.md"
    delete_file "page-renamed.md"

    request = {
      :path         => "page-renamed.md",
      :front_matter => { :foo => "bar" },
      :raw_content  => "test"
    }

    put "/pages/page-rename.md", request.to_json
    expect(last_response).to be_ok
    expect(last_response_parsed["foo"]).to eq("bar")
    expect("page-rename.md").to_not be_an_existing_file
    expect("page-renamed.md").to be_an_existing_file

    get "/pages/page-renamed.md"
    expect(last_response).to be_ok
    expect(last_response_parsed["foo"]).to eq("bar")

    delete_file "page-rename.md", "page-renamed.md"
  end

  it "deletes a page" do
    path = write_file "page-delete.md"
    delete "/pages/page-delete.md"
    expect(last_response).to be_ok
    expect(File.exist?(path)).to eql(false)
  end
end
